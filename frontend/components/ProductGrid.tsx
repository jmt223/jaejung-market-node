import Link from "next/link";
import { imageUrl } from "@/lib/format";
import { Product } from "@/lib/types";

// 상품 카드 목록 (메인에서 씀)
export default function ProductGrid({ posts }: { posts: Product[] }) {
  return (
    <div className="product-grid">
      {posts.map((post) => (
        <div className="product-item" key={post.id}>
          <Link href={`/posts/${post.id}`}>
            <div className="product-image">
              {post.fileName && <img src={imageUrl(post.fileName)} alt={post.title} />}
            </div>
            <div className="product-info">
              <h3 className="product-title">{post.title}</h3>
              <p className="product-price">{post.price} 원</p>
              <p className="product-stock">재고: {post.stock}</p>
              <p className="product-category">{post.category}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
