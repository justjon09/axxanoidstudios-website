<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CmsField extends Model
{
    use HasFactory;

    protected $table = 'cms_fields';
    protected $fillable = ['schema_id', 'label', 'handle', 'field_type', 'validation_rules', 'sort_order'];

    public function schema()
    {
        return $this->belongsTo(CmsSchema::class, 'schema_id');
    }
}