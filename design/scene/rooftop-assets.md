# Rooftop asset prototype

| Runtime asset | Source | Changes |
| --- | --- | --- |
| `public/rooftop/concrete.jpg` and `concrete-normal.jpg` | [Concrete 011 · ambientCG](https://ambientcg.com/view?id=Concrete011) | Selected the color and OpenGL normal maps from the 1K JPG package and resized them to 768 px. The terrace, start stairs and first landing share one material. |
| `public/rooftop/aircon.glb` | [Exterior Aircon Unit · Poly Haven](https://polyhaven.com/a/exterior_aircon_unit) | Packed the clean 1K glTF variant as a single GLB with 512 px textures. The model is scaled to the existing obstacle dimensions. Both units share geometry and textures. |
| `public/rooftop/sunset.hdr` | [Joburg Central Sunset · Poly Haven](https://polyhaven.com/a/sunset_jhbcentral) | Used the 1K HDR for dark-mode reflections. |

All three sources are CC0. [ambientCG license](https://docs.ambientcg.com/license/) · [Poly Haven license](https://polyhaven.com/license)

The runtime files total approximately 3.0 MiB. They are requested when the Home game mounts. The existing visual fixtures, physics geometry, theme switch and light-mode environment remain in use.
