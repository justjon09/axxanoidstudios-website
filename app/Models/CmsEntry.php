<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsEntry extends Model
{
    use HasFactory;

    protected $table = 'cms_entries';
    protected $fillable = ['schema_id', 'title', 'slug', 'data', 'is_published', 'author_id'];
    protected $casts = ['data' => 'array', 'is_published' => 'boolean'];

    public function schema()
    {
        return $this->belongsTo(CmsSchema::class, 'schema_id');
    }
}