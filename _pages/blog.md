---
layout: default
permalink: /blog/
title: Writing
nav: true
nav_order: 4
---

<div class="post">
  <header class="post-header">
    <h1>Writing</h1>
    <p class="post-description">Blogs on my personal experiences and things I've learned along the way.</p>
  </header>

  {% assign featured_posts = site.posts | where: 'featured_on_writing', true %}
  {% for post in featured_posts %}
    <article class="writing-feature">
      <p class="writing-type">{{ post.blog_type | default: 'Personal experience' }} <span aria-hidden="true">&middot;</span> {{ post.date | date: '%B %Y' }}</p>
      <h2><a href="{{ post.redirect | default: post.url | relative_url }}">{{ post.title }}</a></h2>
      <p>{{ post.description }}</p>
      <a class="writing-read-link" href="{{ post.redirect | default: post.url | relative_url }}">Read story <span aria-hidden="true">&#8594;</span></a>
    </article>
  {% endfor %}

  {% assign other_posts = site.posts | where_exp: 'post', 'post.featured_on_writing != true' %}
  {% if other_posts.size > 0 %}
    <h2 class="writing-more-title">More writing</h2>
    <ul class="writing-list">
      {% assign writing_posts = other_posts %}
      {% for post in writing_posts %}
        <li>
          <p class="post-meta">{{ post.blog_type | default: 'Article' }} <span aria-hidden="true">&middot;</span> {{ post.date | date: '%B %Y' }}{% if post.external_source %} &middot; {{ post.external_source }}{% endif %}</p>
          <h2><a href="{{ post.redirect | default: post.url | relative_url }}">{{ post.title }}</a></h2>
          <p>{{ post.description }}</p>
        </li>
      {% endfor %}
    </ul>
  {% endif %}
</div>
