AFRAME.registerComponent("bullets", {
  init: function () {
    this.shootBullet();
  },
  shootBullet: function () {
    window.addEventListener("keydown", (e) => {
      if (e.key === "z") {
        var bullet = document.createElement("a-entity");

        bullet.setAttribute("geometry", {
          primitive: "sphere",
          radius: 0.1,
        });

        bullet.setAttribute("material", "color", "black");

        var cam = document.querySelector("#camera-rig");

        pos = cam.getAttribute("position");

        bullet.setAttribute("position", {
          x: pos.x,
          y: pos.y+1,
          z: pos.z-0.5,
        });

        var camera = document.querySelector("#camera").object3D;

        //Obtener la dirección de la cámara como un vector de Three.js
        var direction = new THREE.Vector3();
        camera.getWorldDirection(direction);

        //Establecer la velocidad y su dirección
        bullet.setAttribute("velocity", direction.multiplyScalar(-50));

        var scene = document.querySelector("#scene");

        //Establecer la bala como una entidad dinámica
        bullet.setAttribute("dynamic-body", {
          shape: "sphere",
          mass: "0",
        });

        //Agregar un escucha de eventos de colisión a la bala
        bullet.addEventListener("collide", this.removeBullet);

        scene.appendChild(bullet);

        //Sonido de disparo
        this.shootSound();
      }
    });
  },
  removeBullet: function (e) {
    var scene = document.querySelector("#scene");
    //Elemento de la bala
    var element = e.detail.target.el;

    //Elemento que es golpeado
    var elementHit = e.detail.body.el;

    if (elementHit.id.includes("enemy")) {
      var countTankel = document.querySelector("#countTank");
      var tanksFired = parseInt(countTankel.getAttribute("text").value);
      tanksFired -= 1;
      countTankel.setAttribute("text",{value:tanksFired})
      if(tanksFired === 0){
        var txt = document.querySelector("#completed")
        txt.setAttribute("visible",true)
      }
      scene.removeChild(elementHit)
      //Eliminar escucha de evento
      element.removeEventListener("collide", this.removeBullet);

      //Remover las balas de la escena
      
      scene.removeChild(element);
    }
  },
  shootSound: function () {
    var entity = document.querySelector("#sound1");
    entity.components.sound.playSound();
  },
});

