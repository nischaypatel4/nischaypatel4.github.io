---
layout: page
title: LncRNAs in Arabidopsis
description: RNA-seq analysis of pollination compatibility identified 1,002 novel and 43 differentially expressed lncRNA loci in Arabidopsis.
img: /assets/img/arabidopsis.jpeg
importance: 3
category: research
github: https://github.com/nischaypatel4/LncRNA-Analysis-Pollination-Arabidopsis
---

## Research context

At **IIT Gandhinagar (Dec 2024–Jul 2026)**, under the supervision of **Prof. Subramanian Sankaranarayanan**, I investigated novel long non-coding RNAs in compatible and incompatible pollination responses.

Long non-coding RNAs do not code for proteins, but play important roles in gene regulation and biological processes in plants, including _Arabidopsis thaliana_.

## Computational workflow

The workflow analyzed **12 pollination samples** across 10- and 60-minute time points using HISAT2 alignment, StringTie assembly, coding-potential testing, Kallisto quantification, and DESeq2. The analysis identified **1,002 novel and 43 differentially expressed lncRNA loci**.

Potential cis- and trans-regulatory interactions were investigated through expression correlation and target prediction, with LncTar, psRNATarget, and Cytoscape supporting lncRNA–mRNA–miRNA network analysis. GO enrichment highlighted stress-defense, pollen–stigma recognition, and self-incompatibility pathways.

The public repository documents sequential analysis stages, including library strandedness, coding potential, transcript-ID reconciliation, FEELnc classification, expression analysis, and cis/trans target prediction. The work combined Galaxy, RStudio, terminal tools, and coding-potential web servers.

## Publication

Patel, N., Gawande, N. D., and Sankaranarayanan, S. (2026). _Frontiers in Plant Science_, 17, 1868651.

[Read the paper](https://doi.org/10.3389/fpls.2026.1868651) · [Methods and code](https://github.com/nischaypatel4/LncRNA-Analysis-Pollination-Arabidopsis) · [Visit the PMDCB Lab](https://www.sankarlab.com/)
