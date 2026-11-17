<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $table = 'media';

    protected $fillable = [
        'file_name',
        'file_path',
        'mime_type',
        'size',
        'responsive_variants',
        'focal_point'
    ];

    protected $casts = [
        'responsive_variants' => 'array',
        'focal_point' => 'array',
        'size' => 'integer'
    ];
}