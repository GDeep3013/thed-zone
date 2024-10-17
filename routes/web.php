<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;
// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Method: POST, GET, OPTIONS, PUT, DELETE');
// header('Access-Control-Allow-Header: Content-Type, X-Auth-Token, Origin Authorization ');
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function (Request $request) {
    return "nothing found";
})->name('home');

// Route::get('/page/{page}/{id}', function (Request $request) {
//     $host = $request->query('host');
//     return view('react', [
//             'shop' => $request->query('shop'),
//             'host' => $host,
//             'appUrl' =>env('APP_URL'),
//             'apiKey' => env('SHOPIFY_API_KEY')
//     ]);
// });
// Route::get('/page/{page}', function (Request $request) {
//     $host = $request->query('host');
//     return view('react', [
//             'shop' => $request->query('shop'),
//             'host' => $host,
//             'appUrl' =>env('APP_URL'),
//             'apiKey' => env('SHOPIFY_API_KEY')
//     ]);
// });

Route::get('/search', [ProductController::class, 'search']);
