---
title: Team
nav:
  order: 3
  tooltip: About our team
---

# <i class="fas fa-users"></i>Team

The T-lab is comprised by phenomenal undergraduates and graduate students of Clark University with different scopes of interest from mycology and genomics all the way to conservation and social justoce in STEM

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
  filters="role: undergrad"
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
