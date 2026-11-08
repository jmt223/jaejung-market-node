import { FormEvent, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { Product } from "@/lib/types";

interface Props {
  product?: Product;
  submitLabel: string;
  imageLabel: string;
  onSubmit: (form: FormData) => void;
}

// 상품 등록, 수정 화면이 똑같아서 하나로 만듬
export default function ProductForm({ product, submitLabel, imageLabel, onSubmit }: Props) {
  const [fileError, setFileError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    // 10MB 넘으면 보내기 전에 여기서 막음 (서버에서도 막는데 그때는 연결이 끊겨서 안내 문구가 안나옴)
    const file = form.get("imageFile") as File | null;
    if (file && file.size > 10 * 1024 * 1024) {
      setFileError("파일 크기가 너무 큽니다.");
      return;
    }

    setFileError("");
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fileError && <p style={{ color: "red" }}>{fileError}</p>}
      <label>
        상품명: <input type="text" name="title" defaultValue={product?.title} required />
      </label>
      <br />
      <label>
        내용: <textarea name="content" rows={5} cols={50} defaultValue={product?.content} />
      </label>
      <br />
      <label>
        가격: <input type="number" name="price" min={0} defaultValue={product?.price} required />
      </label>
      <br />
      <label>
        재고: <input type="number" name="stock" min={0} defaultValue={product?.stock} required />
      </label>
      <br />
      <label>
        카테고리:{" "}
        <select name="category" defaultValue={product?.category ?? ""} required>
          <option value="">선택하세요</option>
          {CATEGORIES.map((category) => (
            <option value={category} key={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <br />
      {/* [보안조치] (4) 악성코드파일 업로드 : accept는 화면용이고 진짜 검사는 서버에서 함 */}
      <label>
        {imageLabel}: <input type="file" name="imageFile" accept=".jpg,.jpeg,.png,.gif" />
      </label>
      <br />
      <button type="submit" className="btn">
        {submitLabel}
      </button>
    </form>
  );
}
