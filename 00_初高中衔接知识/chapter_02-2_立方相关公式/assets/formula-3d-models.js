(() => {
  const colors = {
    blue:0x3b6fea,
    blueDeep:0x1f4fbf,
    amber:0xf08f3c,
    purple:0x8b5cf6,
    cyan:0x16a7b7,
    red:0xef4444,
    green:0x10b981,
    gray:0x94a3b8
  };

  function hasWebGL() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (error) {
      return false;
    }
  }

  function supify(text) {
    return text
      .replaceAll('²', '<sup>2</sup>')
      .replaceAll('³', '<sup>3</sup>')
      .replaceAll('->', '<span aria-hidden="true">→</span>');
  }

  function addEdges(mesh, color = 0xffffff, opacity = .74) {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color,
      transparent:true,
      opacity
    }));
    mesh.add(line);
  }

  function disposeObject(object) {
    object.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(material => material.dispose());
        else child.material.dispose();
      }
    });
  }

  function buildLab(root, options) {
    root.innerHTML = `
      <div class="model-scene">
        <canvas aria-label="${options.label}"></canvas>
        <div class="model-loader">3D 模型加载中...</div>
        <div class="model-fallback" hidden>当前浏览器没有加载 WebGL 模型，仍可阅读右侧公式步骤。</div>
        <div class="model-tags" aria-hidden="true"></div>
        <div class="model-caption"></div>
      </div>
      <div class="model-panel">
        <div class="model-steps" aria-label="${options.stepsLabel || '模型步骤'}"></div>
        <div class="model-control"></div>
        <div class="model-formula"></div>
      </div>
    `;
    return {
      root,
      canvas:root.querySelector('canvas'),
      loader:root.querySelector('.model-loader'),
      fallback:root.querySelector('.model-fallback'),
      tags:root.querySelector('.model-tags'),
      caption:root.querySelector('.model-caption'),
      steps:root.querySelector('.model-steps'),
      control:root.querySelector('.model-control'),
      formula:root.querySelector('.model-formula')
    };
  }

  class BaseModel {
    constructor(refs) {
      this.refs = refs;
      this.scene = new THREE.Scene();
      this.cameraFrustum = 7.4;
      this.camera = new THREE.OrthographicCamera(-3.7, 3.7, 3.7, -3.7, .1, 100);
      this.camera.position.set(5.5, 4.5, 7);
      this.camera.lookAt(0, 0, 0);
      this.renderer = new THREE.WebGLRenderer({
        canvas:refs.canvas,
        antialias:true,
        alpha:true,
        preserveDrawingBuffer:true
      });
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      this.root = new THREE.Group();
      this.root.rotation.set(.28, .78, 0);
      this.targetRotation = {x:.28, y:.78};
      this.dynamic = new THREE.Group();
      this.root.add(this.dynamic);
      this.scene.add(this.root);
      this.drag = null;
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      this.buildLights();
      this.bindPointer();
      this.resize();
      this.animate();
    }

    buildLights() {
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0xdbe5f2, 1.08));
      const key = new THREE.DirectionalLight(0xffffff, 1.48);
      key.position.set(5, 7, 6);
      this.scene.add(key);
      const fill = new THREE.DirectionalLight(0xc7d8ff, .7);
      fill.position.set(-4, 3, -5);
      this.scene.add(fill);
    }

    clearDynamic() {
      while (this.dynamic.children.length) {
        const child = this.dynamic.children.pop();
        disposeObject(child);
      }
    }

    addBox(dimensions, position, color, opacity = .86) {
      const geometry = new THREE.BoxGeometry(dimensions[0], dimensions[1], dimensions[2]);
      const material = new THREE.MeshPhysicalMaterial({
        color,
        transparent:true,
        opacity,
        roughness:.54,
        metalness:0,
        clearcoat:.12,
        depthWrite:opacity > .58
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(position[0], position[1], position[2]);
      addEdges(mesh, 0xffffff, opacity > .5 ? .78 : .48);
      this.dynamic.add(mesh);
      return mesh;
    }

    bindPointer() {
      this.refs.canvas.addEventListener('pointerdown', event => {
        this.drag = {
          x:event.clientX,
          y:event.clientY,
          rx:this.targetRotation.x,
          ry:this.targetRotation.y
        };
        this.refs.canvas.setPointerCapture(event.pointerId);
      });
      this.refs.canvas.addEventListener('pointermove', event => {
        if (!this.drag) return;
        const dx = event.clientX - this.drag.x;
        const dy = event.clientY - this.drag.y;
        this.targetRotation.y = this.drag.ry + dx * .008;
        this.targetRotation.x = Math.max(-.9, Math.min(.35, this.drag.rx + dy * .006));
      });
      const end = event => {
        if (!this.drag) return;
        this.drag = null;
        if (event.pointerId !== undefined && this.refs.canvas.hasPointerCapture(event.pointerId)) {
          this.refs.canvas.releasePointerCapture(event.pointerId);
        }
      };
      this.refs.canvas.addEventListener('pointerup', end);
      this.refs.canvas.addEventListener('pointercancel', end);
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const rect = this.refs.canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const aspect = width / height;
      this.camera.left = -this.cameraFrustum * aspect / 2;
      this.camera.right = this.cameraFrustum * aspect / 2;
      this.camera.top = this.cameraFrustum / 2;
      this.camera.bottom = -this.cameraFrustum / 2;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height, false);
      this.render();
    }

    animate() {
      requestAnimationFrame(() => this.animate());
      if (!this.reducedMotion && !this.drag) {
        this.targetRotation.y += .0012;
      }
      this.root.rotation.x += (this.targetRotation.x - this.root.rotation.x) * .08;
      this.root.rotation.y += (this.targetRotation.y - this.root.rotation.y) * .08;
      this.render();
    }

    render() {
      this.renderer.render(this.scene, this.camera);
    }
  }

  class DifferenceCubeModel extends BaseModel {
    constructor(refs) {
      super(refs);
      this.stage = 0;
      this.bRatio = .32;
      this.stages = [
        {title:'从 a³ 开始', caption:'把 (a-b)³ 看成从边长 a 的立方体里留下边长 a-b 的小立方体。', tags:['a³','留下 (a-b)³'], formula:['先从边长 a 的立方体开始。']},
        {title:'减去三片', caption:'长、宽、高三个方向各切掉一片厚度 b 的部分。', tags:['-a²b','-a²b','-a²b'], formula:['a³ - a²b - a²b - a²b', '= a³ - 3a²b']},
        {title:'加回重叠', caption:'三片相交的棱柱被重复减掉，需要加回三块 ab²。', tags:['+ab²','+ab²','+ab²'], formula:['a³ - 3a²b + ab² + ab² + ab²', '= a³ - 3a²b + 3ab²']},
        {title:'减去角块', caption:'最角上的 b³ 被加回过头，最后还要减掉一次。', tags:['-b³'], formula:['a³ - 3a²b + 3ab² - b³']},
        {title:'得到公式', caption:'剩下的立方体边长就是 a-b。', tags:['(a-b)³'], formula:['(a-b)³ = a³ - 3a²b + 3ab² - b³']}
      ];
      this.buildControls();
      this.setStage(0);
    }

    buildControls() {
      this.stages.forEach((stage, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'model-step';
        button.dataset.stage = String(index);
        button.textContent = `${index + 1}. ${stage.title}`;
        button.addEventListener('click', () => this.setStage(index));
        this.refs.steps.appendChild(button);
      });
      this.refs.control.innerHTML = `
        <label class="model-range">
          <span>b 的厚度</span>
          <input type="range" min="18" max="40" value="30">
        </label>
      `;
      this.refs.control.querySelector('input').addEventListener('input', event => {
        this.bRatio = Number(event.target.value) / 100;
        this.draw();
      });
    }

    center(range, size) {
      return [
        (range[0] + range[1]) / 2 - size / 2,
        (range[2] + range[3]) / 2 - size / 2,
        (range[4] + range[5]) / 2 - size / 2
      ];
    }

    box(range, size, offset = [0,0,0]) {
      const dimensions = [range[1] - range[0], range[3] - range[2], range[5] - range[4]];
      const center = this.center(range, size).map((value, index) => value + offset[index]);
      return {dimensions, center};
    }

    setStage(index) {
      this.stage = index;
      this.refs.steps.querySelectorAll('.model-step').forEach((button, buttonIndex) => {
        button.setAttribute('aria-pressed', String(buttonIndex === index));
      });
      this.updateText();
      this.draw();
    }

    updateText() {
      const data = this.stages[this.stage];
      this.refs.caption.textContent = data.caption;
      this.refs.tags.innerHTML = data.tags.map(tag => `<span>${supify(tag)}</span>`).join('');
      this.refs.formula.innerHTML = data.formula.map(line => `<span>${supify(line)}</span>`).join('');
    }

    draw() {
      this.clearDynamic();
      const size = 3.2;
      const b = size * this.bRatio;
      const c = size - b;
      const whole = this.box([0,size,0,size,0,size], size);
      const target = this.box([0,c,0,c,0,c], size);
      const slabs = [
        this.box([c,size,0,size,0,size], size, [.38,0,0]),
        this.box([0,size,c,size,0,size], size, [0,.38,0]),
        this.box([0,size,0,size,c,size], size, [0,0,.38])
      ];
      const overlaps = [
        this.box([c,size,c,size,0,size], size, [.34,.34,0]),
        this.box([c,size,0,size,c,size], size, [.34,0,.34]),
        this.box([0,size,c,size,c,size], size, [0,.34,.34])
      ];
      const corner = this.box([c,size,c,size,c,size], size, [.42,.42,.42]);

      if (this.stage === 0) {
        this.addBox(whole.dimensions, whole.center, colors.gray, .18);
        this.addBox(target.dimensions, target.center, colors.blue, .78);
      }
      if (this.stage === 1) {
        this.addBox(whole.dimensions, whole.center, colors.gray, .12);
        this.addBox(target.dimensions, target.center, colors.blue, .35);
        slabs.forEach(box => this.addBox(box.dimensions, box.center, colors.red, .72));
      }
      if (this.stage === 2) {
        this.addBox(target.dimensions, target.center, colors.blue, .28);
        slabs.forEach(box => this.addBox(box.dimensions, box.center, colors.red, .22));
        overlaps.forEach(box => this.addBox(box.dimensions, box.center, colors.green, .82));
      }
      if (this.stage === 3) {
        this.addBox(target.dimensions, target.center, colors.blue, .22);
        overlaps.forEach(box => this.addBox(box.dimensions, box.center, colors.green, .3));
        this.addBox(corner.dimensions, corner.center, colors.purple, .9);
      }
      if (this.stage === 4) {
        this.addBox(whole.dimensions, whole.center, colors.gray, .12);
        this.addBox(target.dimensions, target.center, colors.blue, .9);
      }
      this.render();
    }
  }

  class SignedCancellationModel extends BaseModel {
    constructor(refs, config) {
      super(refs);
      this.config = config;
      this.stage = 0;
      this.progress = 0;
      this.stages = [
        {title:'准备乘开', caption:config.prepareCaption, tags:[config.factorTag], formula:[config.factorLine]},
        {title:'乘开六项', caption:'把两个因式逐项相乘，会出现两个立方项和两对混合项。', tags:['六个乘积项'], formula:config.expandedLines},
        {title:'拖动抵消', caption:'拖动进度，让同形的一正一负体积块互相抵消。', tags:['+a²b 与 -a²b','+ab² 与 -ab²'], formula:config.cancelLines},
        {title:'剩下立方项', caption:config.finalCaption, tags:[config.finalTag], formula:[config.finalLine]}
      ];
      this.buildControls();
      this.setStage(0);
    }

    buildControls() {
      this.stages.forEach((stage, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'model-step';
        button.dataset.stage = String(index);
        button.textContent = `${index + 1}. ${stage.title}`;
        button.addEventListener('click', () => this.setStage(index));
        this.refs.steps.appendChild(button);
      });
      this.refs.control.innerHTML = `
        <label class="model-range">
          <span>抵消进度</span>
          <input type="range" min="0" max="100" value="0">
        </label>
      `;
      this.progressLabel = this.refs.control.querySelector('.model-range');
      this.progressInput = this.refs.control.querySelector('input');
      this.progressInput.addEventListener('input', event => {
        this.progress = Number(event.target.value) / 100;
        this.draw();
      });
    }

    setStage(index) {
      this.stage = index;
      if (index !== 2) {
        this.progress = index > 2 ? 1 : 0;
        this.progressInput.value = String(Math.round(this.progress * 100));
      }
      this.refs.control.hidden = index !== 2;
      this.progressLabel.hidden = index !== 2;
      this.refs.steps.querySelectorAll('.model-step').forEach((button, buttonIndex) => {
        button.setAttribute('aria-pressed', String(buttonIndex === index));
      });
      this.updateText();
      this.draw();
    }

    updateText() {
      const data = this.stages[this.stage];
      this.refs.caption.textContent = data.caption;
      this.refs.tags.innerHTML = data.tags.map(tag => `<span>${supify(tag)}</span>`).join('');
      this.refs.formula.innerHTML = data.formula.map(line => `<span>${supify(line)}</span>`).join('');
    }

    termData() {
      const a = 1.45;
      const b = .92;
      const finalBColor = this.config.negativeB ? colors.red : colors.cyan;
      return [
        {id:'a3', dimensions:[a,a,a], start:[-1.98,-.78,-.2], color:colors.blue, opacity:.9, final:true},
        {id:'b3', dimensions:[b,b,b], start:[2.04,-.82,.24], color:finalBColor, opacity:.88, final:true},
        {id:'pa2b', dimensions:[a,a,b], start:[-1.12,1.05,-.35], cancel:[-.55,.78,0], color:colors.amber, opacity:.84},
        {id:'na2b', dimensions:[a,a,b], start:[.92,1.05,.35], cancel:[-.55,.78,0], color:colors.red, opacity:.72, negative:true},
        {id:'pab2', dimensions:[a,b,b], start:[-1.1,-2.0,-.35], cancel:[.52,-1.42,0], color:colors.purple, opacity:.84},
        {id:'nab2', dimensions:[a,b,b], start:[.92,-2.0,.35], cancel:[.52,-1.42,0], color:colors.red, opacity:.72, negative:true}
      ];
    }

    draw() {
      this.clearDynamic();
      const progress = this.stage === 2 ? this.progress : this.stage > 2 ? 1 : 0;
      this.termData().forEach(term => {
        if (this.stage === 0 && !term.final) {
          this.addBox(term.dimensions, term.start, term.color, .22);
          return;
        }
        if (this.stage === 3 && !term.final) {
          return;
        }
        const position = term.cancel
          ? term.start.map((value, index) => value + (term.cancel[index] - value) * progress)
          : term.start;
        const opacity = term.final ? term.opacity : term.opacity * (1 - progress * .96);
        this.addBox(term.dimensions, position, term.color, Math.max(.08, opacity));
      });
      this.render();
    }
  }

  class CubeSumVolumeModel extends BaseModel {
    constructor(refs) {
      super(refs);
      this.cameraFrustum = 8.8;
      this.root.rotation.set(.2, .7, 0);
      this.targetRotation = {x:.2, y:.7};
      this.resize();
      this.stage = 0;
      this.aRatio = .56;
      this.stages = [
        {
          title:'叠放立方',
          caption:'为了看清立方和，先把小立方 a³ 放到大立方 b³ 的上方角落，再沿着边标出一块体积为 ab(b-a) 的长方体。',
          tags:['大立方 b³','小立方 a³','切块 ab(b-a)'],
          formula:['a³+b³ = 剩余体积 + ab(b-a)']
        },
        {
          title:'标出切块',
          caption:'切下来的长方体尺寸可以看成 a、b、b-a，体积不变，仍然是 ab(b-a)。',
          tags:['a','b','b-a'],
          formula:['切块体积 = ab(b-a)']
        },
        {
          title:'移动切块',
          caption:'把这块长方体旋转后放到剩余图形的上面。上面补出高度 a，下面原来已有高度 b。',
          tags:['搬移不改变体积','上面补高 a'],
          formula:['剩余体积 + ab(b-a) = a³+b³']
        },
        {
          title:'出现共同高度',
          caption:'重排后的新立体整体高度都是 a+b。底面积由一条 b(b-a) 的长条和一个 a² 的方块组成。',
          tags:['共同高度 a+b','底面积 b(b-a)+a²'],
          formula:['a³+b³ = (a+b)(b(b-a)+a²)']
        },
        {
          title:'写成公式',
          caption:'底面积 b(b-a)+a² 化简为 b²-ab+a²，也就是 a²-ab+b²。',
          tags:['高 a+b','底面积 a²-ab+b²'],
          formula:['a³+b³ = (a+b)(a²-ab+b²)']
        }
      ];
      this.buildControls();
      this.setStage(0);
    }

    buildControls() {
      this.stages.forEach((stage, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'model-step';
        button.dataset.stage = String(index);
        button.textContent = `${index + 1}. ${stage.title}`;
        button.addEventListener('click', () => this.setStage(index));
        this.refs.steps.appendChild(button);
      });
      this.refs.control.innerHTML = `
        <label class="model-range">
          <span>a 相对 b 的大小</span>
          <input type="range" min="36" max="68" value="56">
        </label>
      `;
      this.refs.control.querySelector('input').addEventListener('input', event => {
        this.aRatio = Number(event.target.value) / 100;
        this.draw();
      });
    }

    center(range, frame) {
      return [
        (range[0] + range[1]) / 2 - frame[0] / 2,
        (range[2] + range[3]) / 2 - frame[1] / 2,
        (range[4] + range[5]) / 2 - frame[2] / 2
      ];
    }

    box(range, frame, offset = [0,0,0]) {
      const dimensions = [range[1] - range[0], range[3] - range[2], range[5] - range[4]];
      const center = this.center(range, frame).map((value, index) => value + offset[index]);
      return {dimensions, center};
    }

    setStage(index) {
      this.stage = index;
      this.refs.steps.querySelectorAll('.model-step').forEach((button, buttonIndex) => {
        button.setAttribute('aria-pressed', String(buttonIndex === index));
      });
      this.updateText();
      this.draw();
    }

    updateText() {
      const data = this.stages[this.stage];
      this.refs.caption.textContent = data.caption;
      this.refs.tags.innerHTML = data.tags.map(tag => `<span>${supify(tag)}</span>`).join('');
      this.refs.formula.innerHTML = data.formula.map(line => `<span>${supify(line)}</span>`).join('');
    }

    parts() {
      const b = 3.2;
      const a = b * this.aRatio;
      const h = a + b;
      const g = .22;
      const frame = [b, b, h];
      return {
        a,
        b,
        h,
        bigCube:this.box([0,b,0,b,0,b], frame, [-1.0,0,-.2]),
        smallCube:this.box([b - a,b,b - a,b,b,h], frame, [-1.0,0,-.2]),
        cut:this.box([b - a,b,0,b - a,0,b], frame, [-1.0,0,-.2]),
        leftRemain:this.box([0,b - a,0,b,0,b], frame, [-1.0,0,-.2]),
        cornerColumn:this.box([b - a,b,b - a,b,0,h], frame, [-1.0,0,-.2]),
        cutAway:this.box([b - a,b,0,b - a,0,b], frame, [1.65,.05,-.2]),
        movedSlab:this.box([0,b - a,0,b,b,h], frame, [-1.0,0,-.2]),
        finalLeft:this.box([0,b - a,0,b,0,b], frame, [-1.0,0,-.2]),
        finalCorner:this.box([b - a,b,b - a,b,0,h], frame, [-1.0,0,-.2]),
        finalMoved:this.box([0,b - a,0,b,b,h], frame, [-1.0,0,-.2]),
        cutPreview:this.box([0,b - a,0,b,b + g,b + g + a], frame, [-1.0,0,-.2])
      };
    }

    shifted(box, offset) {
      return box.center.map((value, index) => value + offset[index]);
    }

    drawInitial(parts) {
      this.addBox(parts.bigCube.dimensions, parts.bigCube.center, colors.green, .32);
      this.addBox(parts.smallCube.dimensions, parts.smallCube.center, colors.cyan, .9);
      this.addBox(parts.cut.dimensions, parts.cut.center, colors.red, .84);
    }

    drawRemainder(parts, opacity = .82) {
      this.addBox(parts.leftRemain.dimensions, parts.leftRemain.center, colors.green, opacity);
      this.addBox(parts.cornerColumn.dimensions, parts.cornerColumn.center, colors.cyan, opacity);
    }

    drawFinal(parts) {
      this.addBox(parts.finalLeft.dimensions, parts.finalLeft.center, colors.green, .82);
      this.addBox(parts.finalCorner.dimensions, parts.finalCorner.center, colors.cyan, .9);
      this.addBox(parts.finalMoved.dimensions, parts.finalMoved.center, colors.red, .78);
    }

    draw() {
      this.clearDynamic();
      const parts = this.parts();

      if (this.stage === 0) {
        this.drawInitial(parts);
      }
      if (this.stage === 1) {
        this.drawRemainder(parts, .36);
        this.addBox(parts.cutAway.dimensions, parts.cutAway.center, colors.red, .86);
      }
      if (this.stage === 2) {
        this.drawRemainder(parts, .82);
        this.addBox(parts.cutPreview.dimensions, parts.cutPreview.center, colors.red, .8);
      }
      if (this.stage === 3) {
        this.drawFinal(parts);
      }
      if (this.stage === 4) {
        this.drawFinal(parts);
      }
      this.render();
    }
  }

  class CubeDifferenceVolumeModel extends BaseModel {
    constructor(refs) {
      super(refs);
      this.cameraFrustum = 8.6;
      this.root.rotation.set(.22, .66, 0);
      this.targetRotation = {x:.22, y:.66};
      this.resize();
      this.stage = 0;
      this.bRatio = .34;
      this.stages = [
        {
          title:'大立方挖去小立方',
          caption:'立方差先看成边长 a 的大立方体，挖去一个边长 b 的小立方体。',
          tags:['a³','- b³'],
          formula:['a³ - b³']
        },
        {
          title:'挖去 b³',
          caption:'小立方体从角上取走以后，剩下的体积不是一个完整立方，而是一个 L 形体积。',
          tags:['挖去 b³','剩余体积'],
          formula:['a³ - b³ = 剩余体积']
        },
        {
          title:'切成三块',
          caption:'把剩余的 L 形体积切成三块：一块 a²(a-b)，一块 ab(a-b)，一块 b²(a-b)。',
          tags:['a²(a-b)','ab(a-b)','b²(a-b)'],
          formula:['a³ - b³ = a²(a-b) + ab(a-b) + b²(a-b)']
        },
        {
          title:'重排三块',
          caption:'三块都有一条长度是 a-b 的边。把这条边朝同一方向对齐，就能把 a-b 提出来。',
          tags:['共同厚度 a-b'],
          formula:['a²(a-b) + ab(a-b) + b²(a-b)', '= (a-b)(a²+ab+b²)']
        },
        {
          title:'得到公式',
          caption:'所以立方差不是先做抵消，而是先看见“大立方挖小立方”的剩余体积。',
          tags:['a³-b³','(a-b)(a²+ab+b²)'],
          formula:['a³ - b³ = (a-b)(a²+ab+b²)']
        }
      ];
      this.buildControls();
      this.setStage(0);
    }

    buildControls() {
      this.stages.forEach((stage, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'model-step';
        button.dataset.stage = String(index);
        button.textContent = `${index + 1}. ${stage.title}`;
        button.addEventListener('click', () => this.setStage(index));
        this.refs.steps.appendChild(button);
      });
      this.refs.control.innerHTML = `
        <label class="model-range">
          <span>b 的边长</span>
          <input type="range" min="22" max="42" value="34">
        </label>
      `;
      this.refs.control.querySelector('input').addEventListener('input', event => {
        this.bRatio = Number(event.target.value) / 100;
        this.draw();
      });
    }

    center(range, size) {
      return [
        (range[0] + range[1]) / 2 - size / 2,
        (range[2] + range[3]) / 2 - size / 2,
        (range[4] + range[5]) / 2 - size / 2
      ];
    }

    box(range, size, offset = [0,0,0]) {
      const dimensions = [range[1] - range[0], range[3] - range[2], range[5] - range[4]];
      const center = this.center(range, size).map((value, index) => value + offset[index]);
      return {dimensions, center};
    }

    setStage(index) {
      this.stage = index;
      this.refs.steps.querySelectorAll('.model-step').forEach((button, buttonIndex) => {
        button.setAttribute('aria-pressed', String(buttonIndex === index));
      });
      this.updateText();
      this.draw();
    }

    updateText() {
      const data = this.stages[this.stage];
      this.refs.caption.textContent = data.caption;
      this.refs.tags.innerHTML = data.tags.map(tag => `<span>${supify(tag)}</span>`).join('');
      this.refs.formula.innerHTML = data.formula.map(line => `<span>${supify(line)}</span>`).join('');
    }

    drawRearranged(size, b, c, finalOnly = false) {
      const commonX = c;
      const large = {dimensions:[commonX, size, size], center:[0, -1.15, .88]};
      const middle = {dimensions:[commonX, size, b], center:[0, -1.15, -1.55]};
      const small = {dimensions:[commonX, b, b], center:[0, 1.28, -1.55]};
      this.addBox(large.dimensions, large.center, colors.blue, finalOnly ? .86 : .78);
      this.addBox(middle.dimensions, middle.center, colors.green, finalOnly ? .86 : .8);
      this.addBox(small.dimensions, small.center, colors.cyan, finalOnly ? .9 : .84);
    }

    draw() {
      this.clearDynamic();
      const size = 3.2;
      const b = size * this.bRatio;
      const c = size - b;
      const whole = this.box([0,size,0,size,0,size], size);
      const removed = this.box([c,size,c,size,c,size], size);
      const pieceA2 = this.box([0,c,0,size,0,size], size);
      const pieceAB = this.box([c,size,0,c,0,size], size);
      const pieceB2 = this.box([c,size,c,size,0,c], size);
      const shifted = (box, offset) => box.center.map((value, index) => value + offset[index]);
      const drawRemaining = (opacity, offsets = {}) => {
        this.addBox(pieceA2.dimensions, shifted(pieceA2, offsets.a2 || [0,0,0]), colors.blue, opacity);
        this.addBox(pieceAB.dimensions, shifted(pieceAB, offsets.ab || [0,0,0]), colors.green, opacity + .03);
        this.addBox(pieceB2.dimensions, shifted(pieceB2, offsets.b2 || [0,0,0]), colors.cyan, opacity + .06);
      };

      if (this.stage === 0) {
        this.addBox(whole.dimensions, whole.center, colors.gray, .1);
        drawRemaining(.72);
        this.addBox(removed.dimensions, shifted(removed, [.72,.58,.58]), colors.red, .78);
      }
      if (this.stage === 1) {
        drawRemaining(.66);
        this.addBox(removed.dimensions, shifted(removed, [1.02,.78,.78]), colors.red, .76);
      }
      if (this.stage === 2) {
        drawRemaining(.78, {
          a2:[-.18,0,0],
          ab:[.44,-.3,0],
          b2:[.62,.34,-.28]
        });
        this.addBox(removed.dimensions, shifted(removed, [1.08,.92,.92]), colors.red, .24);
      }
      if (this.stage === 3) {
        this.drawRearranged(size, b, c);
      }
      if (this.stage === 4) {
        this.drawRearranged(size, b, c, true);
      }
      this.render();
    }
  }

  function safeInit(rootId, factory) {
    const root = document.getElementById(rootId);
    if (!root) return null;
    const refs = buildLab(root, {label:root.getAttribute('data-label') || '公式三维模型'});
    try {
      if (!window.THREE || !hasWebGL()) throw new Error('WebGL is not available');
      const model = factory(refs);
      refs.loader.hidden = true;
      refs.fallback.hidden = true;
      root.dataset.renderer = 'three';
      return model;
    } catch (error) {
      refs.loader.hidden = true;
      refs.fallback.hidden = false;
      root.dataset.renderer = 'fallback';
      console.warn('[DGOpenKS] formula model fallback:', error);
      return null;
    }
  }

  window.DGFormulaModels = {
    initDifferenceCube(rootId) {
      return safeInit(rootId, refs => new DifferenceCubeModel(refs));
    },
    initCubeSum(rootId) {
      return safeInit(rootId, refs => new CubeSumVolumeModel(refs));
    },
    initCubeDifference(rootId) {
      return safeInit(rootId, refs => new CubeDifferenceVolumeModel(refs));
    }
  };
})();
