"""Capture existing service page copy without inventing or rewriting it.

Run from any directory: python3 migration/extract-pages.py
This updates migration data only; it does not publish or modify the website.
"""

import json
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}


class Node:
    def __init__(self, tag="", attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def all(self, tag=None, css_class=None):
        found = []
        for child in self.children:
            if isinstance(child, Node):
                if (tag is None or child.tag == tag) and (css_class is None or css_class in child.attrs.get("class", "").split()):
                    found.append(child)
                found.extend(child.all(tag, css_class))
        return found

    def text(self):
        def raw(node):
            return "".join(raw(c) if isinstance(c, Node) else c for c in node.children)
        return " ".join(raw(self).split())


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.stack = [self.root]
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def first_text(node, tag=None, css_class=None):
    matches = node.all(tag, css_class)
    return matches[0].text() if matches else ""


def extract_page(filename):
    document = Document(ROOT / "migration/source" / filename).root
    main = document.all("main")[0]
    hero = main.all("section", "service-hero")[0]
    image = hero.all("img")[0]
    sections = []
    for section in main.all("section", "service-section"):
        cards = []
        articles = section.all("article")
        for article in articles:
            icons = article.all("use")
            cards.append({
                "title": first_text(article, "h3"),
                "text": first_text(article, "p"),
                "icon": icons[0].attrs.get("href", "").split("#")[-1] if icons else "",
                "step": first_text(article, css_class="step"),
            })
        card_paragraphs = {id(p) for article in articles for p in article.all("p")}
        sections.append({
            "eyebrow": first_text(section, css_class="overline"),
            "title": first_text(section, "h2"),
            "paragraphs": [p.text() for p in section.all("p") if id(p) not in card_paragraphs and "overline" not in p.attrs.get("class", "").split()],
            "cards": cards,
            "layout": "steps" if section.all(css_class="process-grid") else "cards" if cards else "text",
            "softBackground": "soft-section" in section.attrs.get("class", "").split(),
        })
    cta = main.all("section", "service-cta")[0]
    return {
        "heading": first_text(hero, "h1"),
        "category": first_text(hero, css_class="overline"),
        "summary": first_text(hero, css_class="lede"),
        "image": image.attrs["src"],
        "imageAlt": image.attrs.get("alt", ""),
        "sections": sections,
        "callToAction": {
            "eyebrow": first_text(cta, css_class="overline"),
            "title": first_text(cta, "h2"),
            "text": [p.text() for p in cta.all("p") if "overline" not in p.attrs.get("class", "").split()][0],
        },
    }


if __name__ == "__main__":
    destination = ROOT / "migration/existing-content.json"
    content = json.loads(destination.read_text())
    count = 0
    for service in content["services"]:
        if service["legacyUrl"]:
            service["page"] = extract_page(service["legacyUrl"])
            count += 1
    destination.write_text(json.dumps(content, indent=2, ensure_ascii=False) + "\n")
    print(f"Captured complete content from {count} existing service pages.")
