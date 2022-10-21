---
title: Team
nav:
  order: 3
  tooltip: About our team
---

{% include banner.html image="images/lab_pic.jpg" %}

# <i class="fas fa-users"></i>Team

The T-lab is comprised by phenomenal undergraduates and graduate students of Clark University with different scopes of interest from mycology and genomics all the way to conservation and social justice in STEM

{% include section.html %}

{%
  include list.html
  data="members"
  component="portrait"
  filters="role: pi"
%}

{%
  include list.html
  data="members"
  component="portrait"
  filters="role: phd"
%}

{%
  include list.html
  data="members"
  component="portrait"
  filters="role: msc"
%}

{%
  include list.html
  data="members"
  component="portrait"
  filters="role: undergrad"
%}

{%
  include list.html
  data="members"
  component="portrait"
  filters="role: alumni"
%}

{%
  include list.html
  data="members"
  component="portrait"
  filters="role: job-ad"
%}

{:.center}

{% include section.html background="images/banner.jpg" dark=true%}

We are always interested in potential Ph. D. students or Postdoctoral researchers that want to join the team!

{%
  include link.html
  icon="fas fa-envelope"
  text="Email"
  tooltip="Email"
  link="mailto:jtabima@clarku.edu"
%}
{:.center}

{% include section.html %}
