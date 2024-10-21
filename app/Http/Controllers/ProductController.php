<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\ProductVariantTrait;
use Http;

class ProductController extends Controller
{
    use ProductVariantTrait;

    
    private $productQuery = <<<PRODUCT
        id
        title
        handle
        description
        vendor
        productType
        createdAt
        updatedAt
        tags
        featuredImage {
        id
        originalSrc
        altText
        }
        media(first: 10) {
        edges {
            node {
            mediaContentType
            ... on MediaImage {
                image {
                originalSrc
                altText
                }
            }
            }
        }
        }
    PRODUCT;


    public function search(Request $request)
    {
        $input = $request->all();
        
        $query = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->get("https://staging.oneapp.today/api/v1/fitment/search-ext",[
            'year' => intval($request->year),
            'make' => $request->make,
            'model' => $request->model,
        ]);

        $getProduct = $query->json();

        $query = "query {\n";
        if (is_array($getProduct) && !empty($getProduct)) {
            $VIDs = [];
            foreach ($getProduct as $index => $product){
                if(!in_array($product,$VIDs)) {
                    $id = $product['variantId'];
                    $VIDs[] = $id;
                    $query .= "  productVariant" . ($index + 1) . ": productVariant(id: \"gid://shopify/ProductVariant/$id\") {\n";
                    $query .= "    id\n";
                    $query .= "    title\n";  
                    $query .= "    price\n";  
                    $query .= "    product {\n";
                    $query .= $this->productQuery;
                    $query .= "    }\n";
                    $query .= "  }\n";

                }
            }
            $query .= "}";

            return  $this->getVariants($query);

        } else  {
            return [];
        }
    }

    public function getMakeJson() {
        $query = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->get("https://thed.zone/wp-content/themes/porto-child/makeJson.json");

        $getProduct = $query->json();
        return response()->json(['data' => $getProduct]);
    }
    public function getModelJson() {
        $query = Http::withHeaders([
            'Content-Type' => 'application/json',
        ])->get("https://thed.zone/wp-content/themes/porto-child/modelJson.json");

        $getProduct = $query->json();
        return response()->json(['data' => $getProduct]);
    }




   
}
