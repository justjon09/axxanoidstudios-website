<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CmsSchema extends Model
{
    protected $table = 'cms_schemas';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'icon',
        'is_public'
    ];

    protected $casts = [
        'is_public' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($schema) {
            if (empty($schema->slug) && !empty($schema->name)) {
                $schema->slug = Str::slug($schema->name);
            }
        });

        static::updating(function ($schema) {
            if (empty($schema->slug) && !empty($schema->name)) {
                $schema->slug = Str::slug($schema->name);
            }
        });
    }

    public function fields()
    {
        return $this->hasMany(CmsField::class, 'schema_id')->orderBy('sort_order', 'asc');
    }

    public function entries()
    {
        return $this->hasMany(CmsEntry::class, 'schema_id');
    }
}