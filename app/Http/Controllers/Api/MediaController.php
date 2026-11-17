<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class MediaController extends Controller
{
    public function index()
    {
        return Media::orderBy('created_at', 'desc')->get();
    }

    public function upload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpg,jpeg,png,webp,pdf,doc,docx|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $file = $request->file('file');
        $path = $file->store('uploads', 'public');
        $mimeType = $file->getMimeType();
        $responsiveVariants = [];

        // Process image variants if the file is an image
        if (str_starts_with($mimeType, 'image/')) {
            $manager = new ImageManager(new Driver());

            $image =$manager->decodePath(Storage::disk('public')->path($path));
            $thumbPath = 'uploads/thumb_' . basename($path);$image->scaleDown(width: 300);
            $image->save(Storage::disk('public')->path($thumbPath));
            
            $responsiveVariants['thumb'] = Storage::url($thumbPath);
        }

        $media = Media::create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => Storage::url($path),
            'mime_type' => $mimeType,
            'size' => $file->getSize(),
            'responsive_variants' => $responsiveVariants,
            'focal_point' => ['x' => 50, 'y' => 50],
        ]);

        return response()->json($media, 201);
    }
}