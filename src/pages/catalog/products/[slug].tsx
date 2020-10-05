import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
// import dynamic from "next/dynamic";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";

import { client } from "@/lib/prismic";

// const AddToCartModal = dynamic(() => import("@/components/AddToCartModel"), {
//   loading: () => <p>Carregando...</p>,
//   ssr: false,
// });

interface ProductProps {
  product: Document;
}

export default function Product({ product }: ProductProps) {
  const router = useRouter();

  // const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  // function handleAddToCart() {
  //   setIsAddToCartModalVisible(true);
  // }

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>{PrismicDOM.RichText.asText(product.data.title)}</h1>

      {/* <button type="button" onClick={handleAddToCart}>
        Add to Cart
      </button> */}

      {/* {isAddToCartModalVisible && <AddToCartModal />} */}

      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      />

      <img src={product.data.thumbnail.url} width="300" alt="" />

      <p>Price: ${product.data.price}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 10, // 10 seconds
  };
};
