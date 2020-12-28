<template>
  <canvas class="map" ref="map"></canvas>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Vec3 } from 'vec3'
import { WorldView, Viewer } from 'prismarine-viewer/viewer'

export default {
  name: 'Map',
  components: {
  },
  data() {
    return {
      renderer: null,
      viewer: null,
      worldView: null,
      controls: null,
    }
  },
  mounted() {
    console.log(this.$refs.map)

    this.aspect = this.$refs.map.clientWidth / this.$refs.map.clientHeight;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.$refs.map, alpha: true, antialias: false });
    this.renderer.setPixelRatio(this.aspect || 1)
    this.renderer.setSize(this.$refs.map.clientWidth, this.$refs.map.clientHeight, false);

    // this.$refs.map.appendChild(this.renderer.domElement)
		


    // this.camera.position.z = 5;

    const version = '1.16.4';
    const World = require('prismarine-world')(version)
    const Chunk = require('prismarine-chunk')(version)
    const viewDistance = 6
    const center = new Vec3(0, 90, 0)

    const generator = (x, y, z) => {
        if (y < 60) return 1
        if (y == 60 && x % 12 && z % 12) return 2
        return 0
    }
    const chunkGenerator = (chunkX, chunkZ) => {
      const chunk = new Chunk()
      for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 16; x++) {
          for (let z = 0; z < 16; z++) {
            chunk.setBlockStateId(new Vec3(x, y, z), generator(chunkX * 16 + x, y, chunkZ * 16 + z))
          }
        }
      }
      return chunk
    }

    const world = new World(chunkGenerator)
    this.worldView = new WorldView(world, viewDistance, center)
    this.viewer = new Viewer(this.renderer)

    this.controls = new OrbitControls(this.viewer.camera, this.$refs.map)


    this.viewer.setVersion(version)
    this.viewer.listen(this.worldView)
    // Initialize viewer, load chunks
    // eslint-disable-next-line no-debugger
    this.worldView.on('loadChunk', () => console.log('hey'))
    this.worldView.init(center)
    this.viewer.camera.position.set(center.x, center.y, center.z)
    this.controls.update()


    // this.observer = new ResizeObserver(() => {
		// 	if (!this.$refs.map)
		// 		return ;
		// 	const { clientWidth: width, clientHeight: height } = this.$refs.map;
		// 	this.camera.aspect = width / height;
		// 	this.camera.updateProjectionMatrix();
		// 	this.renderer.setSize(width, height, false);
		// });
		// this.observer.observe(this.$refs.map);

    this.animate();
  },
  destroyed() {
  },
  methods: {
    animate() {
      requestAnimationFrame(this.animate.bind(this));
      if (this.controls) this.controls.update()
      this.worldView.updatePosition(this.controls.target)
      this.renderer.render( this.viewer.scene, this.viewer.camera );
    }
  }
}
</script>

<style lang="scss">
	.map {
		width: 100%;
		height: calc(100% - 64px);
	}

</style>
