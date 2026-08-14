"""Cut the eight sponsor figures out of the couple's Attire Guide card.

Same recipe as the first card's brushstrokes: alpha = a soft ramp on RGB
distance from the paper white, so painted edges stay feathered. The figures
here are cleanly separated by paper, so column gaps are enough to segment
them — no colour-change scan needed.

Two things the naive version gets wrong, hence the longest-run trims:
  * the card's own captions ("DUSTY PINK", "FLOOR LENGTH GOWN") sit a few
    pixels above and below the figures and get swept into the crop;
  * the thin vertical rule between Ninang and Ninong reads as a 3px "figure".
Both are short runs, so taking the LONGEST contiguous run of rows/columns
keeps the figure and drops them.
"""
from PIL import Image
import numpy as np, os
from scipy.ndimage import label, binary_dilation

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "attire-principal.jpg")   # the planner's source card, gitignored
OUT = os.path.join(ROOT, "assets")

im = Image.open(SRC).convert("RGB")
a = np.asarray(im).astype(np.float64)
paper = np.array([250, 249, 245], dtype=np.float64)
d = np.sqrt(((a - paper) ** 2).sum(2))
alpha = np.clip((d - 20.0) / 26.0, 0, 1)   # clear below 20, opaque above 46
mask = alpha > 0.12


def runs_of(profile, thr):
    out, s = [], None
    for i, v in enumerate(profile):
        on = v > thr
        if on and s is None:
            s = i
        if not on and s is not None:
            out.append((s, i))
            s = None
    if s is not None:
        out.append((s, len(profile)))
    return out


def longest(profile, thr):
    r = runs_of(profile, thr)
    return max(r, key=lambda t: t[1] - t[0])


BANDS = [
    # prefix, y0, y1, x0, x1  — generous windows; the trims do the real work
    ("principal", 530, 864, 150, 900),
    ("secondary", 1072, 1404, 200, 900),
]
NAMES = ["gown", "midi", "choice1", "choice2"]

report = []
for prefix, y0, y1, x0, x1 in BANDS:
    cruns = [r for r in runs_of(mask[y0:y1, x0:x1].sum(0), 3) if r[1] - r[0] > 30]
    assert len(cruns) == 4, (prefix, cruns)

    for name, (cs, ce) in zip(NAMES, cruns):
        cx0, cx1 = x0 + cs, x0 + ce
        ry0, ry1 = longest(mask[y0:y1, cx0:cx1].sum(1), 3)
        ry0, ry1 = y0 + ry0, y0 + ry1
        # re-trim columns inside the figure's own rows
        rx0, rx1 = longest(mask[ry0:ry1, cx0:cx1].sum(0), 1)
        rx0, rx1 = cx0 + rx0, cx0 + rx1

        # Keep only the figure itself. The bottom-left floral of the card
        # reaches into the secondary ninang's crop, and stray caption pixels
        # survive the row trim; both are separate blobs, so labelling and
        # keeping the largest connected component clears them. Dilate first so
        # a 1px antialiased gap does not split a figure in two.
        sub = alpha[ry0:ry1, rx0:rx1].copy()

        # The card's bottom-left flowers are painted OVER the secondary
        # ninang's skirt, so they arrive as one connected blob with her — no
        # labelling can separate them. They are white petals and grey-green
        # leaves against dusty pink, so a hue test does: keep only pixels
        # where red clearly leads blue. Confined to the bottom of that one
        # crop, because the navy suits would fail this test everywhere.
        if f"{prefix}-{name}" == "secondary-gown":
            hsub = ry1 - ry0
            band = slice(int(hsub * 0.60), hsub)
            rgb_b = a[ry0 + band.start:ry1, rx0:rx1]
            petal = (rgb_b[..., 0] - rgb_b[..., 2]) < 22
            sub[band][petal] = 0.0
            # A pink-and-gold blossom survives the hue test — it is the same
            # family of colour as the dress. It sits in the bottom-left corner,
            # below and outside the hem, so it goes by geometry. These three
            # cuts are hand-checked against THIS card file: the skirt's own
            # left edge at each of those rows is well right of the cut.
            sub[317:, :] = 0.0
            sub[300:317, :16] = 0.0
            sub[284:300, :8] = 0.0

        core = binary_dilation(sub > 0.06, iterations=1)
        lab, n = label(core)
        if n > 1:
            keep = np.argmax(np.bincount(lab.ravel())[1:]) + 1
            before = sub.sum()
            sub = np.where(lab == keep, sub, 0.0)
            lost = 1 - sub.sum() / before
            if lost > 0.02:
                print(f"  ! {prefix}-{name}: dropped {lost:.1%} of ink")

        ys, xs = np.where(sub > 0.06)
        sub = sub[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
        ry0, ry1 = ry0 + ys.min(), ry0 + ys.max() + 1
        rx0, rx1 = rx0 + xs.min(), rx0 + xs.max() + 1

        rgb = a[ry0:ry1, rx0:rx1].astype(np.uint8)
        al = (sub * 255).astype(np.uint8)
        img = Image.fromarray(np.dstack([rgb, al]))
        path = os.path.join(OUT, f"sponsor-{prefix}-{name}.webp")
        img.save(path, "WEBP", quality=90, method=6)
        report.append((os.path.basename(path), img.width, img.height,
                       (ry0, ry1), (rx0, rx1), os.path.getsize(path)))

for r in report:
    print(r)
print("total bytes", sum(r[5] for r in report))
