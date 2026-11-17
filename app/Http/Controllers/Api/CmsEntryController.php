<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsEntry;
use App\Models\CmsSchema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CmsEntryController extends Controller
{
    public function index(string $schemaSlug)
    {
        $schema = CmsSchema::where('slug', $schemaSlug)->firstOrFail();

        $query = CmsEntry::where('schema_id', $schema->id)->orderBy('updated_at', 'desc');

        if (request()->has('published')) {
            $query->where('is_published', request('published') === '1');
        }

        return response()->json($query->get());
    }

    public function showAdmin(string $id)
    {
        $entry = CmsEntry::with(['schema.fields', 'revisions'])->findOrFail($id);
        return response()->json($entry);
    }

    public function store(Request $request, string $schemaSlug)
    {
        $schema = CmsSchema::with('fields')->where('slug', $schemaSlug)->firstOrFail();

        $payload = $request->all();
        if (empty($payload['slug']) && !empty($payload['title'])) {
            $payload['slug'] = Str::slug($payload['title']);
        }
        if (!isset($payload['data']) || !is_array($payload['data'])) {
            $payload['data'] = [];
        }

        $rules = [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:cms_entries,slug,NULL,id,schema_id,' . $schema->id,
            'is_published' => 'boolean',
            'data' => 'present|array',
            'data.main_body' => 'nullable|string',
        ];

        foreach ($schema->fields as $field) {
            $rules['data.' . $field->handle] = $field->validation_rules ? $field->validation_rules : 'nullable';
        }

        $validator = Validator::make($payload, $rules);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $entry = CmsEntry::create([
            'schema_id' => $schema->id,
            'title' => $payload['title'],
            'slug' => $payload['slug'],
            'data' => $payload['data'],
            'is_published' => (bool) ($payload['is_published'] ?? false),
            'author_id' => $request->user()?->id,
        ]);

        return response()->json($entry, 201);
    }

    public function show(string $schemaSlug, string $entrySlug)
    {
        $schema = CmsSchema::where('slug', $schemaSlug)->firstOrFail();
        $entry = CmsEntry::where('schema_id', $schema->id)
            ->where('slug', $entrySlug)
            ->firstOrFail();

        return response()->json($entry);
    }

    public function update(Request $request, string $id)
    {
        $entry = CmsEntry::findOrFail($id);
        $schema = CmsSchema::with('fields')->findOrFail($entry->schema_id);

        $payload = $request->all();
        if (isset($payload['title']) && empty($payload['slug'])) {
            $payload['slug'] = Str::slug($payload['title']);
        }

        $rules = [
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:cms_entries,slug,' . $id . ',id,schema_id,' . $schema->id,
            'is_published' => 'sometimes|boolean',
            'data' => 'sometimes|array',
            'data.main_body' => 'nullable|string',
        ];

        foreach ($schema->fields as $field) {
            $rules['data.' . $field->handle] = $field->validation_rules ? $field->validation_rules : 'nullable';
        }

        $validator = Validator::make($payload, $rules);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $entry->update([
            'title' => $payload['title'] ?? $entry->title,
            'slug' => $payload['slug'] ?? $entry->slug,
            'data' => $payload['data'] ?? $entry->data,
            'is_published' => isset($payload['is_published']) ? (bool) $payload['is_published'] : $entry->is_published,
        ]);

        return response()->json($entry->fresh(['revisions']));
    }

    public function destroy(string $id)
    {
        $entry = CmsEntry::findOrFail($id);
        $entry->delete();

        return response()->json(null, 204);
    }
}