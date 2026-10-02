KOI_SRC ?= ../braille-koi/src
KOI_DST := src/vendor/braille-koi
KOI_FILES := braille.ts keymap.ts pond.ts BrailleKoi.tsx index.ts
LINT_ARGS ?=

.PHONY: dev dev-check build lint typecheck test-now vendor-koi

dev:
	npm run dev

# Verify emitted JS chunks too: HTML alone can hide broken dev output.
dev-check:
	node scripts/check-dev.mjs

build:
	npm run build

lint:
	npm run lint -- $(LINT_ARGS)

typecheck:
	npx tsc --noEmit

# Node 22+ can run the Markdown renderer's TypeScript directly.
test-now:
	node --experimental-strip-types --test scripts/test-now-annotations.mjs

# Refresh the vendored braille koi pond from the sibling repo.
vendor-koi:
	@for f in $(KOI_FILES); do cp $(KOI_SRC)/$$f $(KOI_DST)/$$f; done
	@echo "vendored braille-koi @ $$(git -C $(KOI_SRC)/.. rev-parse --short HEAD)"
