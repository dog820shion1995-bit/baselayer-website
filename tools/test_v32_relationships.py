#!/usr/bin/env python3
"""Offline regression tests for sourced comparison relationships."""
import copy
import json
import pathlib
import sys
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from validate_relationships import validate


class RelationshipGateTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.products = json.loads((ROOT / "data/products.json").read_text(encoding="utf-8"))
        cls.rows = json.loads((ROOT / "data/relationships.json").read_text(encoding="utf-8"))

    def test_current_relationships_are_valid(self):
        self.assertEqual(validate(self.rows, self.products), [])

    def test_reject_missing_target(self):
        row = copy.deepcopy(self.rows[0])
        row["to_model"] = "NOT-A-REAL-MODEL"
        self.assertTrue(any("missing to product" in e for e in validate([row], self.products)))

    def test_reject_missing_source(self):
        row = copy.deepcopy(self.rows[0])
        row["source"] = "http://example.com/"
        self.assertTrue(validate([row], self.products))

    def test_reject_future_date(self):
        row = copy.deepcopy(self.rows[0])
        row["checked"] = "2099-01-01"
        self.assertTrue(any("future" in e for e in validate([row], self.products)))

    def test_reject_missing_alternative_caveat(self):
        row = copy.deepcopy(self.rows[0])
        row.pop("note", None)
        self.assertTrue(any("limitation note" in e for e in validate([row], self.products)))

    def test_reject_duplicate_relationship(self):
        row = copy.deepcopy(self.rows[0])
        self.assertTrue(any("duplicate" in e for e in validate([row, row], self.products)))

    def test_reject_unsubstantiated_official_successor(self):
        row = copy.deepcopy(self.rows[0])
        row["relation"] = "official_successor"
        self.assertTrue(any("manufacturer statement" in e for e in validate([row], self.products)))

    def test_reject_official_successor_on_third_party_host(self):
        row = copy.deepcopy(self.rows[0])
        row["relation"] = "official_successor"
        row["official_statement"] = "Manufacturer statement requires manual verification"
        row["source"] = "https://example.org/product"
        self.assertTrue(any("manufacturer-hosted" in e for e in validate([row], self.products)))


if __name__ == "__main__":
    unittest.main()
