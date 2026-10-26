# How to edit the lab website

You do not need to code. Every change below is "edit a text file on GitHub, save, wait about two minutes."

**To edit on GitHub:** open the file in this repository, click the pencil icon, make the change, and click **Commit changes**. The site rebuilds automatically.

**To check a change before it goes live:** choose **Create a new branch and start a pull request** when you commit. GitHub builds a private preview of the site and posts the link on the pull request. Merge it when you like what you see.

---

## The easy way: the lab editor (with a login)

Go to **tabimalab.science/admin/** (or the "Lab editor (log in)" link in the footer of any page). It shows forms instead of files: fill in the boxes, add photos by clicking, press **Save**. It covers the Home page, Research programs, the Join and Contact pages, People and Blog posts.

**Logging in (once per person):**
1. You must be a collaborator with write access on the GitHub repository (Javier adds people under Settings, Collaborators).
2. On GitHub, go to Settings, Developer settings, Personal access tokens, Fine-grained tokens, **Generate new token**. Choose the repository `TabimaLab/lab_website` only, and under Permissions set **Contents: Read and write**.
3. At /admin/ choose **Sign in with GitHub token** and paste it. The browser remembers it.

Every save is a normal GitHub commit under your name, so **History** on GitHub still lets you undo anything. Saving in the editor removes the explanatory comments at the top of `home.yaml` and `projects.yaml`; the instructions live in this guide.

**Edit this page:** the footer of every page has an **Edit this page** link that opens that page's file on GitHub, where you log in with your usual GitHub account.

---

## What lives where

| I want to change... | Edit this | Notes |
|---|---|---|
| The words on the home page | `_data/home.yaml` | Headline, intro, the "people" and "join" blocks. Use `*stars*` for italics. |
| The round picture on the home page | `_data/home.yaml` (`hero.image`) | Upload the photo to `images/` first, then change the file name. |
| Research programs (home and Research page) | `_data/projects.yaml` | Copy a block under `programs:` to add one. The instructions are at the top of the file. |
| Photo albums (the Photos page) | `_data/photos.yaml` | One entry per shared album: title, link, cover photo. Easiest in the lab editor, under Photo albums. |
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

`nav: order:` puts it in the top menu. The numbers decide the left-to-right order (Research is 1, Publications 2, Team 3, Join 4, Photos 5, Contact 6). Leave `nav:` out to keep the page out of the menu.

---

## A video in the round window on the home page

Videos straight from a camera or phone are huge (hundreds of MB to GB) and will not load on a website. Shrink it first. On any computer with [ffmpeg](https://ffmpeg.org) installed:

```
ffmpeg -i original.mov -t 12 -vf "crop='min(iw,ih)':'min(iw,ih)',scale=720:720,fps=24" -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -an -movflags +faststart hero.mp4
```

That keeps the first 12 seconds, crops to a square, removes sound, and usually lands at 2 to 6 MB. Change `-t 12` to pick the length and `-ss 00:00:30` (before `-i`) to start later. If it is still over 6 MB, raise `-crf 28` to 30 to 32.

Then upload `hero.mp4` to the `images` folder on GitHub and, in `_data/home.yaml`, remove the `#` in front of `video:` and fix the name (or use the **Round video** box in the lab editor). The round photo stays as the placeholder while the video loads, and for people who have "reduce motion" turned on.

---

## The growing fungus on the home page

It is drawn by `assets/js/hyphae.js`. It grows from the round photo, bends toward the cursor, and grows around the text. People who have "reduce motion" turned on, and slow devices, see the finished drawing instead of the animation. If you want it calmer or busier, the settings are the numbers at the top of that file.

---

## If something looks wrong

- **The site did not update:** open the **Actions** tab on GitHub. A red X means the build failed, and the log says which file has the problem. Most failures are a missing space after a colon in a `.yaml` file, or an unclosed quote.
- **Undo a change:** open the file, click **History**, and revert to an earlier version.
- **Home page text looks wrong after editing `home.yaml`:** every line must keep its indentation (two spaces per level).
