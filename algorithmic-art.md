# Algorithmic Art: Examples and Resources

Algorithmic or generative art is made by designing a system of rules, parameters, and controlled randomness, then generating and curating the system's outputs. p5.js is one of the best starting points because it runs in the browser, supports animation and interaction, and has a large creative-coding community.

## Start Here: Interactive Galleries

### Generative Art Gallery

<https://aljazfrancic.github.io/generative-art-gallery/>

A p5.js gallery containing 13 adjustable examples:

- Flow fields
- Fractal trees
- Particle systems
- Wave interference
- Mandelbrot and Julia fractals
- Voronoi diagrams
- Cellular automata
- Spirographs
- Reaction-diffusion
- Perlin-noise landscapes
- Lissajous curves
- Circle packing
- Maze generation

The Flow Field example exposes controls for particle count, noise scale, speed, trail fading, colors, and field evolution. It can randomize the output, export PNG files, and record video.

### p5 Scrapbox

<https://nekodigi.github.io/p5-scrapbox/>

A larger collection of more than 50 interactive p5.js sketches covering particles, fractals, waves, cellular automata, physics, generative compositions, 3D scenes, and algorithm visualizations.

### Generative Art Pack Gallery

<https://skinnye.github.io/generative-art-pack/>

A live gallery associated with a generative-art agent and skill pack. Its examples cover seeded sketches, flow fields, shaders, color systems, and export-oriented workflows.

### Official p5.js Examples

<https://p5js.org/examples/>

Official examples covering noise, recursive trees, flocking, particles, shaders, interaction, geometry, and animation.

## Representative Visual Directions

### 1. Flow Fields

**Appearance:** Wind, hair, topographic currents, smoke, silk strands, or flowing ink.

**System:** A two-dimensional field stores a direction at every position. Hundreds or thousands of particles follow those directions, leaving trails that reveal the otherwise invisible field.

**Good for:** Ambient backgrounds, print-like line art, animated currents, and seeded series.

**p5.js suitability:** Excellent.

**Reference:** Tyler Hobbs, “Flow Fields”  
<https://www.tylerxhobbs.com/words/flow-fields>

This is a particularly useful reference because it shows how careful composition, curve placement, color, and curation can turn a common technical effect into finished artwork.

### 2. Reaction-Diffusion

**Appearance:** Coral, animal markings, cells, fingerprints, chemical growth, or alien organic textures.

**System:** Two simulated chemicals interact and diffuse across a grid. Repeating the simulation produces spots, stripes, branching structures, and moving boundaries.

**Good for:** Organic animation, audio-reactive visuals, textures, and experimental backgrounds.

**p5.js suitability:** Good for small or optimized simulations. Larger real-time work may benefit from WebGL shaders.

**Example:** Select “Reaction-Diffusion” in the Generative Art Gallery.  
<https://aljazfrancic.github.io/generative-art-gallery/>

### 3. Circle Packing and Voronoi Systems

**Appearance:** Bubbles, stones, cells, stained glass, territories, or geometric poster compositions.

**Circle-packing system:** Circles are placed and enlarged until they touch another circle or the canvas boundary.

**Voronoi system:** The canvas is divided according to which seed point is closest to each position.

**Good for:** Static illustrations, logos, poster layouts, decorative patterns, and data-driven compositions.

**p5.js suitability:** Excellent.

**Interactive tutorial:**  
<https://generativeartistry.com/tutorials/circle-packing/>

### 4. Particle Systems and Flocking

**Appearance:** Fireworks, dust, stars, fireflies, ink, smoke, schools of fish, or bird-like swarms.

**System:** Individual agents move under forces or steering rules. Flocking commonly combines alignment, separation, and cohesion.

**Good for:** Interactive backgrounds, music visualizers, simulations, and responsive motion.

**p5.js suitability:** Excellent, provided the particle count is kept appropriate for the device.

**Official flocking example:**  
<https://p5js.org/examples/Classes-And-Objects-Flocking/>

### 5. Recursive and Botanical Forms

**Appearance:** Trees, roots, lightning, coral, snowflakes, vascular structures, or nested geometric forms.

**System:** A drawing rule repeatedly calls itself with a smaller scale, altered angle, or changed position. L-systems use a related grammar-based approach.

**Good for:** Botanical imagery, fractals, decorative illustration, and educational visualizations.

**p5.js suitability:** Excellent.

**Example:** Look for “Recursive Tree” in the official gallery.  
<https://p5js.org/examples/>

### 6. Geometric Poster Art

**Appearance:** Minimalist grids, rotated squares, interrupted lines, subdivisions, woven patterns, and architectural compositions.

**System:** Simple geometric rules are repeated across a grid, with carefully constrained randomness controlling rotation, spacing, scale, or omission.

**Good for:** Posters, album art, editorial graphics, SVG export, and plotter drawings.

**p5.js suitability:** Excellent.

**Tutorial collection:**  
<https://generativeartistry.com/tutorials/>

Useful examples include:

- Tiled Lines
- Cubic Disarray
- Un Deux Trois
- Hypnotic Squares
- Joy Division
- Triangular Mesh

### 7. Shader Art

**Appearance:** Fluid, plasma, nebulae, procedural fabric, distorted glass, animated gradients, grain, and glowing abstract fields.

**System:** A GPU program calculates the color of every pixel or manipulates geometry in parallel. Noise, signed-distance fields, feedback, and raymarching are common techniques.

**Good for:** Smooth full-screen animation, procedural textures, 3D effects, and high-performance pixel-based visuals.

**p5.js suitability:** Good through p5.js WebGL and shaders, though direct GLSL or Three.js may provide more control for advanced work.

**Interactive lessons:**  
<https://thebookofshaders.com/>

## Classic Generative-Art Tutorials

Generative Artistry provides approachable recreations of important early and modern generative techniques:

<https://generativeartistry.com/tutorials/>

Recommended sequence:

1. Tiled Lines — repetition and binary randomness
2. Cubic Disarray — controlled disorder
3. Joy Division — displaced line systems
4. Triangular Mesh — geometric structure
5. Circle Packing — collision and spatial composition
6. Hypnotic Squares — recursion

## What Makes the Work Look Finished

The difference between a technical demo and strong algorithmic art usually is not a more complicated algorithm. It is the quality of the artistic system around it:

- Controlled rather than unrestricted randomness
- Strong composition and negative space
- Deliberate color relationships
- A small set of meaningful parameters
- Seeded, reproducible outputs
- Texture, grain, and variation in mark-making
- Performance appropriate to the intended device
- Generating many candidates and curating the strongest outputs

Community galleries are useful for understanding algorithm categories. Artists such as Tyler Hobbs are better references for seeing how those systems can become polished work through composition, color, texture, and curation.

## Recommended Directions for This Site

### Option 1: Subtle Monochrome Flow Field

Thin seeded linework that moves slowly or renders as a static composition. This would feel calm and elegant without competing heavily with the page content.

### Option 2: Slowly Evolving Noise or Shader Texture

A restrained procedural field with gentle gradients, grain, or fluid distortion. This can feel atmospheric and premium, but motion and contrast need careful limits.

### Option 3: Sparse Geometric Subdivision or Circle Packing

Mostly static geometric compositions with a small amount of seeded variation. This is crisp, inexpensive to render, and easier to keep accessible.

The strongest starting point is likely a restrained flow field with seeded variations. It offers a recognizable algorithmic-art character while remaining suitable for a portfolio background.

## Suggested First Prototype

Build a seeded p5.js sketch with:

- Four to six meaningful artistic parameters
- A reproducible random seed
- A seed browser or regenerate control
- PNG export
- A contact sheet showing multiple seeds
- Reduced-motion support
- A lightweight mobile mode
- Screenshot-based visual review

This keeps the first experiment focused on composition and curation rather than building a large visual engine too early.
