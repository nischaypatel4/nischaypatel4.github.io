---
layout: page
title: Single-cell links between ACP and tooth development
description: A 32,000-cell ACP workflow and cross-tissue comparison with tooth-developmental atlases, developed as an Amgen Scholar at Tsinghua.
importance: 1
category: research
featured: true
github: https://github.com/nischaypatel4/scRNA-ACP-pipeline
---

## Research context

**Amgen Scholars Program · Tsinghua University · Jun–Aug 2025**  
Supervised by **Prof. Yinqing Li**.

Adamantinomatous craniopharyngioma (ACP) is a tumor with cell states that can be compared with developmental reference tissues. I built a single-cell RNA-seq workflow for **32,000 ACP tumor cells** and investigated transcriptional relationships with tooth-developmental populations.

## Approach

The analysis integrated feature selection, PCA, clustering, and cell-type annotation. For cross-tissue comparison, I applied the pretrained **SCimilarity** search tool, which uses 128-dimensional triplet-loss embeddings and a reference training set of 23 million cells.

Cross-tissue transfer learning identified tooth-related atlases as close matches. Differential-expression and GO enrichment analyses highlighted conserved **WNT-signaling and morphogenesis pathways**.

The public **Nextflow DSL2** repository organizes ACP quality control and integration, reference-atlas processing, cross-tissue integration, visualization, and downstream enrichment, with Docker configuration and Python/R environments.

## Research communication

Presented as a poster at the **Amgen Scholars Asia Symposium, Kyoto University**, and the **BSBE Day Symposium, IIT Kanpur (2025)**. This work received the Best Poster Presentation (1st Prize) and Summer Innovation Awards at BSBE Day.

[View the pipeline](https://github.com/nischaypatel4/scRNA-ACP-pipeline) · [View the poster](https://drive.google.com/file/d/1sZRD0J-JnKjKQi50GQF6TywQSfAJNBMr/view?usp=drive_link)
