<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsSchema extends Model
{
    use HasFactory;

    protected $table = 'cms_schemas';
    protected $fillable = ['name', 'slug', 'description', 'icon', 'is_public'];

    public function fields()
    {
        return $this->hasMany(CmsField::class, 'schema_id')->orderBy('sort_order', 'asc');
    }

    public function entries()
    {
        return $this->hasMany(CmsEntry::class, 'schema_id');
    }
}