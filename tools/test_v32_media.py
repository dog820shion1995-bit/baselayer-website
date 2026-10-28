#!/usr/bin/env python3
"""Regression tests for the offline media permission gate (no network calls)."""
import copy
import json
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from validate_v32_media import validate


class MediaGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        products = json.loads((ROOT / "data/products.json").read_text(encoding="utf-8"))
        cls.licensed = next(
            p for p in products if p.get("brand") == "Synology" and p.get("model") == "DS918+"
        )

    def check_rejected(self, change):
        record = copy.deepcopy(self.licensed)
        change(record)
        errors, _ = validate([record])
        self.assertTrue(errors, "Invalid media metadata must be rejected")

    def test_known_licensed_record(self):
        errors, permitted = validate([copy.deepcopy(self.licensed)])
        self.assertEqual(errors, [])
        self.assertEqual(permitted, 1)

    def test_missing_photo_uses_fallback(self):
        record = copy.deepcopy(self.licensed)
        record.pop("image")
        errors, permitted = validate([record])
        self.assertEqual(errors, [])
        self.assertEqual(permitted, 0)

    def test_reject_wrong_model(self):
        self.check_rejected(lambda p: p["image"].update(model="DS920+"))

    def test_reject_unapproved_usage(self):
        self.check_rejected(lambda p: p["image"].update(usage="unknown"))

    def test_reject_wrong_license(self):
        self.check_rejected(lambda p: p["image"].update(license="All rights reserved"))

    def test_reject_missing_creator(self):
        self.check_rejected(lambda p: p["image"].update(creator=""))

    def test_reject_wrong_source_host(self):
        self.check_rejected(lambda p: p["image"].update(source="https://example.org/wiki/File:Synology_DS918%2B.png"))

    def test_reject_mismatched_file(self):
        self.check_rejected(lambda p: p["image"].update(url="https://commons.wikimedia.org/wiki/Special:Redirect/file/Other_NAS.png"))

    def test_reject_future_review(self):
        self.check_rejected(lambda p: p["image"].update(checked="2099-01-01"))

    def test_reject_duplicate_model(self):
        record = copy.deepcopy(self.licensed)
        errors, _ = validate([record, copy.deepcopy(record)])
        self.assertTrue(any("duplicate" in error for error in errors))


if __name__ == "__main__":
    unittest.main()
