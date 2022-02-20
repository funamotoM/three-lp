//サーバーを立ち上げるときは、個々のディレクトにまで移動して
//npm run dev を打ち込む
import './style.css'

import * as THREE from "three";
import * as dat from "lil-gui";
import { AlphaFormat } from 'three';
import { Mesh } from 'three';
import { DirectionalLight } from 'three';
import { MeshDepthMaterial } from 'three';

//UIデバック（dat）
const gui = new dat.GUI();

//canvasの取得
const canvas = document.querySelector(".Webgl");

/**
 * 必須の酸要素を追加
 */
//シーン
const scene = new THREE.Scene();

//サイズ設定
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//カメラ
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 6;
scene.add(camera);

//レンダラー
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  //背景画像を透明にする
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);


//マテリアル
const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.86,
  roughness: 0.37,
  flatShading: true, //ポリゴンが見える
});

//GUIで変更
gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

//メッシュ
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16 ), material);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

//ジオメトリ配置、回転
mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];

//パーティクル
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const positionArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++){
  positionArray[i] = (Math.random() - 0.5) * 10;
};

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.025,
  color: "#ffffff",
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

//ライト
const directionalLight = new THREE.DirectionalLight("#ffffff", 4);
scene.add(directionalLight);
directionalLight.position.set(0.5, 1, 0);

//リサイズ
window.addEventListener("resize", () => {
  //サイズのアップデート
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //カメラのアスペクト比
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //レンダーのアップデート
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});

//ホイールでジオメトリを回転
let speed = 0;//ホイールのスピード
let rotation = 0;
window.addEventListener("wheel", (event) =>{
  speed += event.deltaY * 0.001;
  //console.log(speed);
});
//ホイールで位置が変える関数
function rot(){
  rotation += speed;
  speed *= 0.93; //慣性が付いた動きになる

  //ジオメトリ全体の回転
  mesh1.position.x = 2 + 3.8 * Math.cos(rotation);
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation);
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2);
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2);
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI);
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI);
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2));
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2));



  window.requestAnimationFrame(rot);
};
rot ();

//カーソルの位置を取得
const cursor = {};
cursor.x = 0;
cursor.y = 0;
console.log(cursor);

window.addEventListener("mousemove", (Event) => {
  //正規化
  cursor.x = Event.clientX / sizes.width - 0.5;
  cursor.y = Event.clientY / sizes.height - 0.5;
  console.log(cursor);
});

//アニメーション
//パソコンのスペックによって回転を変更
const clock = new THREE.Clock;

const animate = () => {
  //リサイズを補助するアニメーション
  renderer.render(scene,camera);

  //時間で回転速度を変更する関数
  let getDeltaTime = clock.getDelta();
  //console.log(getDeltaTime);


  //ジオメトリを回転
  for(const mesh of meshes){
    mesh.rotation.x += 0.08 * getDeltaTime;
    mesh.rotation.y += 0.08 * getDeltaTime;
  };

  //カメラの制御
  camera.position.x += cursor.x * getDeltaTime * 1.5;
  camera.position.y += -cursor.y * getDeltaTime * 1.5;
  window.requestAnimationFrame(animate);
};
animate();


