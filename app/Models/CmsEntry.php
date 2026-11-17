<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CmsEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'cms_entries';
    protected $fillable = ['schema_id', 'title', 'slug', 'data', 'is_published', 'author_id'];
    protected $casts = ['data' => 'array', 'is_published' => 'boolean'];

    public function schema()
    {
        return $this->belongsTo(CmsSchema::class, 'schema_id');
    }

    public function revisions()
    {
        return $this->hasMany(CmsRevision::class, 'entry_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::updated(function ($entry) {
            if ($entry->isDirty('data')) {
                $nextVersion = $entry->revisions()->max('version') + 1;
                $entry->revisions()->create([
                    'data' => $entry->getOriginal('data'),
                    'version' => $nextVersion,
                    'user_id' => request()->user()?->id ?? null,
                ]);
            }
        });
    }
}