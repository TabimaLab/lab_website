---
title: T-lab webpage Home
---

{% include section.html full=true %}

{% include banner.html image="images/banner.jpg" %}

{% include section.html %}

# Welcome to the Tabima lab webpage @ Clark University

The T-lab is interested in identifying the patterns of genomic evolution of fungal species and populations, specially focused on the evolution, systematics, and the genomics of secondary metabolism of the genus *Basidiobolus*.

{:.center}

{% capture text %}
A list of our highlighted publications and research made by our lab members.

[Our list of publications &nbsp;→](research)
{:.left}
{% endcapture %}

{%
  include feature.html
  image="images/pubs.jpg"
  link="research"
  headline="Our Research"
  text=text
%}

{% capture text %}
The T-lab is comprised by phenomenal undergraduates and graduate students of Clark University with different scopes of interest

[Meet our team &nbsp;→](team)
{:.center}
{% endcapture %}

{%
  include feature.html
  image="images/team.jpg"
  link="team"
  headline="Our Team"
  text=text
%}

{% capture text %}
(*Page in progress*) Here we store our tools, data sets and other elements of our research

[See our resources &nbsp;→](resources)
{:.right}
{% endcapture %}

{%
  include feature.html
  image="images/resources.jpg"
  link="resources"
  headline="Our Resources"
  text=text
%}