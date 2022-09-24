const { readFileSync } = require("fs");
const { JSDOM } = require("jsdom");
const dom = new JSDOM(readFileSync(process.stdin.fd, "utf-8"));
const window = dom.window;
const document = window.document;

function* renderHighlights(highlights) {
    const spanParts = [];
    let spanColor = null;
    const makeSpan = () => {
        const span = document.createElement("span");
        span.style.color = spanColor;
        span.textContent = spanParts.join("");
        return span;
    };
    for (const [string, color] of highlights) {
        if (color !== null && color !== spanColor) {
            if (spanColor === null) {
                spanColor = color;
            }
            yield makeSpan();
            spanParts.length = 0;
            spanColor = color;
        }
        spanParts.push(string);
    }
    yield makeSpan();
}

function* carryRippleHighlight(code) {
    const LIGHT = "#F9F5D7";
    const DARK = "#999382";
    const COLOR_MAP = {
        "0": LIGHT,
        "f": DARK,
        "1": LIGHT,
        "F": DARK,
        "&": LIGHT,
        "+": LIGHT,
        "|": LIGHT,
        "[": LIGHT,
        "]": LIGHT
    };
    const CHAR_MAP = {
        "f": "0",
        "F": "1"
    };
    let first = true;
    for (const line of code.split("\n")) {
        if (first) {
            first = false;
        } else {
            yield "\n";
        }
        yield* renderHighlights([...line].map(c => [CHAR_MAP[c] || c, COLOR_MAP[c] || null]));
    }
}

for (const codeBlock of document.getElementsByClassName("language-custom-carry-ripple")) {
    codeBlock.replaceChildren(...carryRippleHighlight(codeBlock.textContent));
}
process.stdout.write(dom.serialize());
