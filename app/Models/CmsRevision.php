<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CmsRevision extends Model
{
    protected $table = 'cms_revisions';

    protected $fillable = ['entry_id', 'data', 'version', 'user_id'];

    protected $casts = ['data' => 'array'];

    public const UPDATED_AT = null;

    public function entry()
    {
        return $this->belongsTo(CmsEntry::class, 'entry_id');
    }
}