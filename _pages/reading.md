---
layout: page
title: Reading
permalink: /reading/
description: A month-by-month log of papers, books, and articles, with starred entries highlighted.
nav: true
---

<div class="reading-controls">
  <div class="reading-search">
    <label for="reading-search">Search the reading log</label>
    <input id="reading-search" type="search" placeholder="Search titles, notes, or tags">
  </div>
  <div class="reading-type-filters" id="reading-types" role="group" aria-label="Filter by resource type"></div>
  <label class="reading-recommended"><input id="reading-recommended" type="checkbox"> Starred entries only</label>
</div>
<p class="reading-count" role="status" aria-live="polite"></p>
<div class="reading-log">
  {% assign months = site.data.reading.entries | group_by: 'month' %}
  {% for month in months %}
    <section class="reading-month">
      <h2>{{ month.name }}</h2>
      <ul>
        {% for entry in month.items %}
          <li class="reading-entry" data-recommended="{{ entry.recommended }}" data-type="{{ entry.type | downcase }}" data-tags="{{ entry.tags | join: ',' | downcase }}">
            <span class="reading-type">{{ entry.type }}{% if entry.recommended %} &middot; <span aria-label="Starred">&#9733;</span>{% endif %}</span>
            <h3><a href="{{ entry.url }}">{{ entry.title }}</a></h3>
            <p>{{ entry.note }}</p>
            {% if entry.tags %}
              <div class="reading-tags" aria-label="Topics">
                {% for tag in entry.tags %}
                  <button type="button" class="reading-tag" data-reading-tag="{{ tag | downcase }}">#{{ tag }}</button>
                {% endfor %}
              </div>
            {% endif %}
          </li>
        {% endfor %}
      </ul>
    </section>
  {% endfor %}
</div>
<p class="reading-empty" id="reading-empty" hidden>No entries match these filters. Try another search or clear a filter.</p>
<noscript><p>All entries are shown. Enable JavaScript to use the filters.</p></noscript>
