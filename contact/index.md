---
title: Contact
layout: page
lede: Questions about the lab, a collaboration, or joining us? Write to us, or stop by.
nav:
  order: 6
---

## Email

<p><a class="btn" href="mailto:{{ site.contact.email }}">{{ site.contact.email }}</a></p>

## Visit

{{ site.contact.directions }}.

<address>
{{ site.contact.building }}<br>
{{ site.contact.street }}<br>
{{ site.contact.city }}
</address>

<p><a class="text-link" href="https://www.google.com/maps/search/?api=1&query={{ site.contact.building | append: ' ' | append: site.contact.street | append: ' ' | append: site.contact.city | uri_escape }}">Open in Google Maps</a></p>

The lab is part of the [Department of Biology](https://www.clarku.edu/departments/biology/) at [Clark University](https://www.clarku.edu/).
