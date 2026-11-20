---
layout: page
title: News
permalink: /news/
description: Publications, research appointments, and academic recognition.
nav: true
---

<ol class="academic-updates">
  {% for update in site.data.updates %}
    <li>
      <time>{{ update.period }}</time>
      <div><a href="{{ update.url | relative_url }}">{{ update.title }}</a><p>{{ update.description }}</p></div>
    </li>
  {% endfor %}
</ol>

<p class="record-note">Dates use the supplied CV and publication records; year-only entries do not imply a specific award month.</p>
