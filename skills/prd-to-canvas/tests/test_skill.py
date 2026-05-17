"""
Smoke tests for prd-to-canvas skill.

Catches regressions in:
  · SKILL.md frontmatter shape
  · All schemas/*.json are valid JSON
  · All prompts/*.md / templates / docs exist
  · md-canvas.html contains required placeholders + no leftover hardcoded
    DIARY/Tencent specifics in non-doc content
  · server.py is importable + key functions exist
  · examples/ai-coach-demo's *.json files validate against their schemas
    (when jsonschema is installed; gracefully skipped otherwise)

Run:
  python3 -m unittest skills.prd_to_canvas.tests.test_skill
  # or from skill dir:
  python3 -m unittest discover -s skills/prd-to-canvas/tests
  # or just:
  python3 skills/prd-to-canvas/tests/test_skill.py
"""
from __future__ import annotations
import json
import pathlib
import re
import sys
import unittest

SKILL_ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(SKILL_ROOT))


class TestSkillStructure(unittest.TestCase):
    """Required files + directories exist."""

    def test_top_level_files(self):
        for name in ["SKILL.md", "README.md", "BLOCK_INVENTORY.md",
                     "WORKFLOW.md", "SERVER.md", "server.py",
                     "requirements.txt"]:
            self.assertTrue((SKILL_ROOT / name).exists(),
                            f"missing top-level file: {name}")

    def test_dirs(self):
        for d in ["prompts", "schemas", "templates", "examples"]:
            self.assertTrue((SKILL_ROOT / d).is_dir(),
                            f"missing dir: {d}")

    def test_required_prompts(self):
        for name in ["phase0-onboarding.md", "phase1-detect.md",
                     "phase1-review.md", "phase2-coverage.md",
                     "phase3-decisions.md", "phase4-rewrite.md",
                     "phase4-review.md"]:
            self.assertTrue((SKILL_ROOT / "prompts" / name).exists(),
                            f"missing prompt: {name}")

    def test_required_schemas(self):
        for name in ["candidates.schema.json", "review.schema.json",
                     "decisions.schema.json",
                     "rewrite-audit.schema.json"]:
            self.assertTrue((SKILL_ROOT / "schemas" / name).exists(),
                            f"missing schema: {name}")

    def test_required_templates(self):
        for name in ["md-canvas.html", "analysis.html",
                     "DESIGN.example.md"]:
            self.assertTrue((SKILL_ROOT / "templates" / name).exists(),
                            f"missing template: {name}")


class TestSkillMd(unittest.TestCase):
    """SKILL.md is the Agent Skills standard entry."""

    def setUp(self):
        self.body = (SKILL_ROOT / "SKILL.md").read_text(encoding="utf-8")

    def test_has_frontmatter(self):
        self.assertTrue(self.body.startswith("---\n"),
                        "SKILL.md missing YAML frontmatter")
        # extract frontmatter block
        m = re.match(r"^---\n(.*?)\n---\n", self.body, re.DOTALL)
        self.assertIsNotNone(m, "frontmatter block not closed")
        fm = m.group(1)
        # required fields
        for key in ["name:", "description:", "when_to_use:"]:
            self.assertIn(key, fm, f"frontmatter missing {key}")

    def test_name_matches_directory(self):
        m = re.search(r"^name:\s*(.+)$", self.body, re.MULTILINE)
        self.assertIsNotNone(m)
        self.assertEqual(m.group(1).strip(), SKILL_ROOT.name,
                         "SKILL.md `name:` must match directory name")


class TestSchemas(unittest.TestCase):
    """All schemas/*.json parse as valid JSON + are valid JSON Schemas."""

    def test_all_schemas_parse(self):
        for f in (SKILL_ROOT / "schemas").glob("*.json"):
            with self.subTest(schema=f.name):
                try:
                    schema = json.loads(f.read_text(encoding="utf-8"))
                except json.JSONDecodeError as e:
                    self.fail(f"{f.name} invalid JSON: {e}")
                # must have $schema or type at root (basic sanity)
                self.assertTrue(
                    "$schema" in schema or "type" in schema,
                    f"{f.name} lacks $schema or type field"
                )


class TestMdCanvasTemplate(unittest.TestCase):
    """md-canvas.html template has required placeholders + no leftover bugs."""

    def setUp(self):
        self.body = (SKILL_ROOT / "templates" / "md-canvas.html"
                     ).read_text(encoding="utf-8")

    def test_placeholders_present(self):
        for ph in ["__PRD_FILENAME__", "__PRD_TITLE__",
                   "__MARKDOWN_SOURCE_INLINE__"]:
            self.assertIn(ph, self.body,
                          f"template missing placeholder {ph}")

    def test_no_hardcoded_diary_filename(self):
        # The string DIARY_MODULE_REQUIREMENTS should not appear (except as
        # a deliberate placeholder example which we don't expect here).
        self.assertNotIn("DIARY_MODULE_REQUIREMENTS", self.body,
                         "template has leftover DIARY hardcoded ref")

    def test_save_uses_python_m_pip_style_token_check(self):
        # save() must include CSRF token in fetch
        self.assertIn("X-MD-Canvas-Token", self.body,
                      "save() not sending CSRF token in header")
        self.assertIn("MD_CANVAS_TOKEN", self.body,
                      "template not reading CSRF token")

    def test_localstorage_quota_handled(self):
        # file-mode save should distinguish quota errors
        self.assertIn("QuotaExceededError", self.body,
                      "file-mode save doesn't handle quota errors")


class TestAnalysisTemplate(unittest.TestCase):
    """analysis.html has required placeholders + no leaky HTML comment."""

    def setUp(self):
        self.body = (SKILL_ROOT / "templates" / "analysis.html"
                     ).read_text(encoding="utf-8")

    def test_placeholders_present(self):
        for ph in ["__COVERAGE_JSON_INLINE__",
                   "__CANDIDATES_JSON_INLINE__",
                   "__DESIGN_OVERRIDE_BLOCK__",
                   "__PRD_PATH__", "__GENERATED_AT__"]:
            self.assertIn(ph, self.body, f"missing placeholder {ph}")

    def test_no_leaky_top_comment(self):
        # The bug we found: HTML comment at top with placeholders inside
        # would be substituted at gen time and leak JSON to visible body.
        # New template shouldn't have that comment.
        # Check first 300 chars don't contain '<!--' before <html>.
        head_chunk = self.body[: self.body.lower().find("<html")]
        self.assertNotIn("<!--", head_chunk,
                         "top-of-file HTML comment risks placeholder leak")


class TestServerPy(unittest.TestCase):
    """server.py is syntactically valid + has expected top-level symbols."""

    def test_import_and_main_callable(self):
        # Importing has to be done carefully because server.py calls
        # app.run only inside main(), so import is safe.
        import importlib.util
        spec = importlib.util.spec_from_file_location(
            "_mdc_server_smoke", SKILL_ROOT / "server.py"
        )
        mod = importlib.util.module_from_spec(spec)
        try:
            spec.loader.exec_module(mod)
        except (SystemExit, ModuleNotFoundError) as e:
            msg = str(e).lower()
            # server.py sys.exits if flask missing — that's our "no flask"
            # signal too, not a code bug
            if "flask" in msg:
                self.skipTest(
                    "flask not installed — run: python3 -m pip install flask"
                )
            self.fail(f"server.py imports raise unexpected error: {e}")
        # Expected top-level symbols
        for sym in ["main", "preflight_git_check", "friendly_git_error",
                    "api_save", "_csrf_check", "_probe_port",
                    "SESSION_TOKEN"]:
            self.assertTrue(hasattr(mod, sym),
                            f"server.py missing symbol: {sym}")

    def test_no_bare_pip_install_in_messages(self):
        body = (SKILL_ROOT / "server.py").read_text(encoding="utf-8")
        # Bare "pip install" in user-facing strings is the bug we found.
        # Allow "python3 -m pip install" or "python -m pip install".
        for m in re.finditer(r'(?<!-m )pip3? install', body):
            ctx = body[max(0, m.start() - 30):m.end() + 30]
            self.fail(f"server.py has bare pip install: ...{ctx}...")


class TestPhase0Onboarding(unittest.TestCase):
    """phase0-onboarding.md doesn't have known regressions."""

    def setUp(self):
        self.body = (SKILL_ROOT / "prompts" / "phase0-onboarding.md"
                     ).read_text(encoding="utf-8")

    def test_no_bare_pip_install_command(self):
        # Bare "pip install" / "pip3 install" in COMMAND positions (after
        # ` or after 'agent 跑 `'). We allow descriptive mentions of
        # "pip install" in prose; specifically code snippets should use
        # `python -m pip`. Multi-line backtick blocks are OK as long as
        # somewhere in the captured command the "-m pip" form appears.
        agent_install = re.findall(
            r"agent 跑.{0,300}?`[^`]*pip[^`]*`", self.body, re.DOTALL
        )
        for cmd in agent_install:
            # Normalize whitespace (newlines + indent) before checking.
            flat = re.sub(r"\s+", " ", cmd)
            self.assertRegex(
                flat, r"-m\s+pip\s+install",
                f"agent install command without -m pip: {flat[:200]}"
            )

    def test_no_python2_fallback(self):
        # The fallback `python3 --version || python --version` was a bug.
        self.assertNotRegex(
            self.body,
            r"python3 --version[^\n]*\|\|[^\n]*python --version",
            "phase0 still has Python 2 fallback in version check"
        )

    def test_venv_check_has_functional_verification(self):
        # We added "$VIRTUAL_ENV/bin/python --version" to verify venv works.
        self.assertIn("VIRTUAL_ENV/bin/python", self.body,
                      "phase0 venv check should actually run venv's python")


class TestDemoExamplesValidate(unittest.TestCase):
    """examples/ai-coach-demo's *.json files validate against their schemas
    (when jsonschema lib available)."""

    @classmethod
    def setUpClass(cls):
        try:
            import jsonschema  # noqa: F401
            cls.has_jsonschema = True
        except ImportError:
            cls.has_jsonschema = False

    def setUp(self):
        if not self.has_jsonschema:
            self.skipTest("jsonschema not installed (run: pip install jsonschema)")

    def _build_registry(self):
        """Build a referencing.Registry so $ref between schema files resolves."""
        from referencing import Registry, Resource
        from referencing.jsonschema import DRAFT202012
        reg = Registry()
        for f in (SKILL_ROOT / "schemas").glob("*.json"):
            content = json.loads(f.read_text(encoding="utf-8"))
            res = Resource(contents=content, specification=DRAFT202012)
            reg = reg.with_resource(uri=f.name, resource=res)
        return reg

    def _validate(self, json_file: pathlib.Path, schema_file: pathlib.Path):
        import jsonschema
        data = json.loads(json_file.read_text(encoding="utf-8"))
        schema = json.loads(schema_file.read_text(encoding="utf-8"))
        registry = self._build_registry()
        validator = jsonschema.Draft202012Validator(schema, registry=registry)
        errors = sorted(validator.iter_errors(data), key=lambda e: e.path)
        if errors:
            msg = "; ".join(f"{list(e.absolute_path)}: {e.message}"
                            for e in errors[:5])
            self.fail(f"{json_file.name} fails {schema_file.name}: {msg}")

    def test_candidates_json_valid(self):
        demo = SKILL_ROOT / "examples" / "ai-coach-demo"
        self._validate(demo / "01-candidates.json",
                       SKILL_ROOT / "schemas" / "candidates.schema.json")

    def test_review_json_valid(self):
        demo = SKILL_ROOT / "examples" / "ai-coach-demo"
        self._validate(demo / "01-review.json",
                       SKILL_ROOT / "schemas" / "review.schema.json")

    def test_decisions_json_valid(self):
        demo = SKILL_ROOT / "examples" / "ai-coach-demo"
        self._validate(demo / "03-decisions.json",
                       SKILL_ROOT / "schemas" / "decisions.schema.json")

    def test_rewrite_audit_json_valid(self):
        demo = SKILL_ROOT / "examples" / "ai-coach-demo"
        self._validate(demo / "04-rewrite-audit.json",
                       SKILL_ROOT / "schemas" / "rewrite-audit.schema.json")


if __name__ == "__main__":
    unittest.main(verbosity=2)
