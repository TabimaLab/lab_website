# How to edit the lab website

You do not need to code. Every change below is "edit a text file on GitHub, save, wait about two minutes."

**To edit on GitHub:** open the file in this repository, click the pencil icon, make the change, and click **Commit changes**. The site rebuilds automatically.

**To check a change before it goes live:** choose **Create a new branch and start a pull request** when you commit. GitHub builds a private preview of the site and posts the link on the pull request. Merge it when you like what you see.

---

## What lives where

| I want to change... | Edit this | Notes |
|---|---|---|
| The words on the home page | `_data/home.yaml` | Headline, intro, the "people" and "join" blocks. Use `*stars*` for italics. |
| The round picture on the home page | `_data/home.yaml` (`hero.image`) | Upload the photo to `images/` first, then change the file name. |
| Research programs (home and Research page) | `_data/projects.yaml` | Copy a block to add one. The instructions are at the top of the file. |
| A person (add, edit, move to alumni) | `_members/first-last.md` | See "Adding a person" below. |
| Publications | Nothing to do | They update every week from Javier's ORCID. Run the **update-citations** action to refresh right now. |
| A blog post | `_posts/YYYY-MM-DD-title.md` | Copy an existing post and change it. |
| The Join page text | `join/index.md` | Plain text with `##` for headings. |
| Address, email, footer links | `_config.yaml` | Top of the file. |
| Colors and fonts | `assets/css/site.css` | Top of the file, in the `:root` block. |

---

## Adding a person

1. Upload their photo to `images/members/` (see "Photos" below).
2. Create a file in `_members/` named like `first-last.md`, and paste this in:

```
---
name: First Last
image: images/members/first-last.jpg
description: PhD Student
role: phd
group: current
links:
  email: someone@clarku.edu
  github: their-github-name
  google: GoogleScholarIdHere
  orcid: 0000-0000-0000-0000
  twitter: their-handle
---
A short bio, one or two paragraphs. Use *stars* for species names.
```

3. `role` decides which heading they appear under: `pi`, `postdoc`, `phd`, `msc`, `undergrad`, or `alumni`.
4. Delete any lines under `links:` that don't apply.
5. Optional: if a face gets cropped badly on the Team page, add `focus: 50% 15%` (left-right, top-bottom).

**Someone graduates or leaves:** change `role:` to `alumni` and `group:` to `alum`. That is the whole change.

The number in "9 people are in the lab right now" counts everyone with `group: current`.

---

## Photos

- Export at **2000 pixels wide or less** and under about **500 KB**. Photos straight from a phone or camera are 5 to 10 MB and make the site slow.
- Free tools that do this in a few clicks: [squoosh.app](https://squoosh.app), or Preview on a Mac (Tools, Adjust Size).
- Use `.jpg` for photos. Avoid `.png` and `.tif` for photographs.
- Portraits look best at about 4 by 5 (a little taller than wide). The Team page shows them in black and white so mixed lighting looks consistent. The person's own page shows color.

---

## Adding a page

Create a folder with an `index.md` file, for example `news/index.md`:

```
---
title: News
layout: page
lede: One sentence that appears under the title.
nav:
  order: 6
---
Your text here.
```

`nav: order:` puts it in the top menu. The numbers decide the left-to-right order (Research is 1, Publications 2, Team 3, Join 4, Contact 5). Leave `nav:` out to keep the page out of the menu.

---

## The growing fungus on the home page

It is drawn by `assets/js/hyphae.js`. It grows from the round photo, bends toward the cursor, and grows around the text. People who have "reduce motion" turned on, and slow devices, see the finished drawing instead of the animation. If you want it calmer or busier, the settings are the numbers at the top of that file.

---

## If something looks wrong

- **The site did not update:** open the **Actions** tab on GitHub. A red X means the build failed, and the log says which file has the problem. Most failures are a missing space after a colon in a `.yaml` file, or an unclosed quote.
- **Undo a change:** open the file, click **History**, and revert to an earlier version.
- **Home page text looks wrong after editing `home.yaml`:** every line must keep its indentation (two spaces per level).
