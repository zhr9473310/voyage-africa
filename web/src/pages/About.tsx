import { BRAND } from '../brand';
export default function About(){
  return (
    <div className="container section">
      <div className="kicker">About</div>
      <h2 className="h2">我们是谁</h2>
      <p>{BRAND.name} 是一家专注非洲目的地的旅行中介平台。我们不直接提供实体服务，仅撮合当地合法商家，并代买门票/预约、打包行程。</p>
      <ul>
        <li>定位：中介撮合 & 透明定价</li>
        <li>优势：本地资源、签证/疫苗知识库、AI 行程效率</li>
        <li>边界：不承诺自然现象必然发生（如动物迁徙/极光等）</li>
      </ul>
    </div>
  );
}
