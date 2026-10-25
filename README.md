# Tabima Lab website

Visit **[tabimalab.science](http://tabimalab.science)**.

Built with [Jekyll](https://jekyllrb.com) and hosted on GitHub Pages. Publications update weekly from ORCID.

**To edit anything on the site, read [EDITING.md](EDITING.md).** It is written for lab members who do not code.

## Run it on your own computer (optional)

```
bundle install
bundle exec jekyll serve --livereload
```

Then open http://localhost:4000.

## Layout

```
_data/home.yaml        words on the home page
_data/projects.yaml    research programs
_data/citations.yaml   publications (written by an automatic job, do not edit)
_members/              one file per person
_posts/                blog posts
_layouts, _includes/   page templates
assets/css/site.css    colors, fonts, spacing
assets/js/             the menu, publication filter, and the growing hyphae
assets/fonts/          Bricolage Grotesque and Newsreader (SIL Open Font License)
images/                photos
```
