<?php

use Illuminate\Support\Facades\Route;

// All non-API web traffic routes directly to the React application shell
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
