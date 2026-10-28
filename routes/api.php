<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CmsSchemaController;
use App\Http\Controllers\Api\CmsEntryController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\LeadController;

// Public Dynamic Content Endpoints
Route::get('/content/{schemaSlug}', [CmsEntryController::class, 'index']);
Route::get('/content/{schemaSlug}/{entrySlug}', [CmsEntryController::class, 'show']);
Route::post('/leads', [LeadController::class, 'store']);

// Admin CMS Endpoints
Route::post('/auth/login', [AuthController::class, 'login']);
Route::prefix('admin')->middleware('auth:web')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::get('/schemas', [CmsSchemaController::class, 'index']);
    Route::post('/schemas', [CmsSchemaController::class, 'store']);
    Route::get('/schemas/{id}', [CmsSchemaController::class, 'show']);
    Route::put('/schemas/{id}', [CmsSchemaController::class, 'update']);
    Route::post('/schemas/{id}/fields', [CmsSchemaController::class, 'addField']);
    Route::get('/entries/{schemaSlug}', [CmsEntryController::class, 'index']);
    Route::post('/entries/{schemaSlug}', [CmsEntryController::class, 'store']);
    Route::put('/entries/{id}', [CmsEntryController::class, 'update']);
    Route::delete('/entries/{id}', [CmsEntryController::class, 'destroy']);

    Route::post('/media/upload', [MediaController::class, 'upload']);
    Route::get('/leads', [LeadController::class, 'index']);
});