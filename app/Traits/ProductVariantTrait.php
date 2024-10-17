<?php 
namespace App\Traits;
use GuzzleHttp\Client;

trait ProductVariantTrait {

    public function getVariants($queryString){

        $shopName = env('SHOPIFY_APP_SHOP_NAME');
        $accessToken = env('SHOPIFY_API_TOKEN');
     
        $shopifyApiUrl = 'https://' . $shopName . '/admin/api/2024-07/graphql.json';
        $client = new Client();
     
        $response = $client->post($shopifyApiUrl, [
            'headers' => [
                'Content-Type' => 'application/json',
                'X-Shopify-Access-Token' => $accessToken,
            ],
            'json' => [
                'query' => $queryString
            ]
        ]);

        return $response->getBody();

    }

}