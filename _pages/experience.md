---
layout: page
title: Research experience
permalink: /experience/
description: Research appointments, advisors, and the questions behind the work.
nav: true
---

<div class="appointment-list">
  {% assign appointments = site.data.resume.work | reverse %}
  {% for appointment in appointments %}
    <section class="appointment">
      <h2><a href="{{ appointment.url }}">{{ appointment.name }}</a></h2>
      <p class="appointment-meta">{{ appointment.position }} &middot; {{ appointment.period }}</p>
      <dl>
        <dt>Advisor</dt><dd>{{ appointment.supervisor }}</dd>
        <dt>Research</dt><dd>{{ appointment.title }}</dd>
      </dl>
      <p>{{ appointment.summary }}</p>
      <a href="{{ '/cv/' | relative_url }}#experience">Methods and full details <span aria-hidden="true">&rarr;</span></a>
    </section>
  {% endfor %}
</div>
