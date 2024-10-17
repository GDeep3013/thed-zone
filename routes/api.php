<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
// use App\Http\Controllers\OrderController;
// use App\Http\Controllers\ProductController;
// use App\Http\Controllers\USPSShippingServiceController;

// header('Access-Control-Allow-Origin: www.thed.zone thed.zone ');
// header('Access-Control-Allow-Method: POST, GET, OPTIONS, PUT, DELETE');
// header('Access-Control-Allow-Header: Content-Type, X-Auth-Token, Origin Authorization ');

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::group(['prefix' => 'v1'], function () {
    Route::get('/make', [ProductController::class, 'getMakeJson']);
    Route::get('/model', [ProductController::class, 'getModelJson']);
    //     Route::any('/order', [OrderController::class, 'getOrder']);
    //     Route::any('/get_order', [OrderController::class, 'getOrderDataUsingAPI']);
    //     Route::any('/request', [OrderController::class, 'storeOrderReturnRequest']);
    //     Route::any('/get-request', [OrderController::class, 'getOrderReturnRequest']);
    //     Route::any('/return-label/{id}', [OrderController::class, 'downloadReturnLabel']);
    //     Route::any('/get-custom-request/{id}', [OrderController::class, 'getCustomerReturnRequest']);


    //     Route::resource('products', ProductController::class);
    //     Route::post('/get-product-variants', [ProductController::class, 'getProductVariants']);
    //     // Route::get('/products/{id}', [ProductController::class, 'getProduct']);
    //     Route::any('/shipment', [USPSShippingServiceController::class, 'createEasyPostShippingLabel']);
    //     // Route::get('/usps', [USPSShippingServiceController::class, 'getShippingRates']);
});
