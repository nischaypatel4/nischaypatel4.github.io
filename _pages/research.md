---
layout: page
title: Research
permalink: /research/
nav: true
---

<section aria-labelledby="papers">
  <h2 id="papers">Publications</h2>
  {% include bib_search.liquid %}
  <div class="publications">
    {% bibliography %}
  </div>
</section>

<section class="research-section poster-section" aria-labelledby="posters">
  <h2 id="posters">Poster presentations</h2>
  <div class="poster-list">
    {% assign poster_award = site.data.resume.awards | where: 'title', 'Best Poster Presentation (1st Prize) & Summer Innovation Awards' | first %}
    {% for poster in site.data.resume.posters %}
      <article class="poster-entry">
        <p class="poster-meta">{{ poster.year }} <span aria-hidden="true">&middot;</span> {{ poster.venue }}</p>
        <h3>{{ poster.name }}</h3>
        {% if forloop.first %}
          <p class="poster-award"><i class="fa-solid fa-trophy" aria-hidden="true"></i> {{ poster_award.title }} <span aria-hidden="true">&middot;</span> {{ poster_award.awarder }}</p>
        {% endif %}
        <a class="poster-link" href="{{ poster.url }}" target="_blank" rel="noopener noreferrer">View poster <span aria-hidden="true">&#8599;</span></a>
      </article>
    {% endfor %}
  </div>
</section>
