<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsEntry;
use App\Models\CmsSchema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CmsEntryController extends Controller
{
    public function index(string $schemaSlug)
    {
        $schema = CmsSchema::where('slug', $schemaSlug)->firstOrFail();

        $query = CmsEntry::where('schema_id', $schema->id);

        if (request()->has('published')) {
            $query->where('is_published', request('published') === '1' ? true : false);
        }

        return $query->get();
    }

    public function store(Request $request, string $schemaSlug)
    {
        $schema = CmsSchema::with('fields')->where('slug', $schemaSlug)->firstOrFail();

        $rules = [
            'title' => 'required|string',
            'slug' => 'required|string|unique:cms_entries,slug,NULL,id,schema_id,' . $schema->id,
            'is_published' => 'boolean',
            'data' => 'required|array',
            'data.main_body' => 'nullable|string',
        ];

        foreach ($schema->fields as $field) {
            $rules['data.' . $field->handle] = $field->validation_rules ? $field->validation_rules : 'nullable';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $entry = CmsEntry::create([
            'schema_id' => $schema->id,
            'title' => $request->title,
            'slug' => $request->slug,
            'data' => $request->input('data'),
            'is_published' => $request->has('is_published') ? $request->is_published : false,
            'author_id' => $request->user()?->id,
        ]);

        return response()->json($entry, 201);
    }

    public function show(string $schemaSlug, string $entrySlug)
    {
        $schema = CmsSchema::where('slug', $schemaSlug)->firstOrFail();
        $entry = CmsEntry::where('schema_id', $schema->id)->where('slug', $entrySlug)->firstOrFail();

        return $entry;
    }

    public function update(Request $request, string $id)
    {
        $entry = CmsEntry::findOrFail($id);
        $schema = CmsSchema::with('fields')->findOrFail($entry->schema_id);

        $rules = [
            'title' => 'sometimes|required|string',
            'slug' => 'sometimes|required|string|unique:cms_entries,slug,' . $id . ',id,schema_id,' . $schema->id,
            'is_published' => 'sometimes|required|boolean',
            'data' => 'sometimes|array',
            'data.main_body' => 'nullable|string',
        ];

        foreach ($schema->fields as $field) {
            $rules['data.' . $field->handle] = $field->validation_rules ? $field->validation_rules : 'nullable';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $entry->update($request->all());

        return response()->json($entry);
    }

    public function destroy(string $id)
    {
        $entry = CmsEntry::findOrFail($id);
        $entry->delete();

        return response()->json(null, 204);
    }
}