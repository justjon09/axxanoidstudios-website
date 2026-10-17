<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsEntry;
use App\Models\CmsSchema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CmsEntryController extends Controller
{
    public function index($schemaSlug)
    {
        $schema = CmsSchema::where('slug', $schemaSlug)->firstOrFail();

        $query = CmsEntry::where('schema_id', $schema->id);

        if (request()->has('published')) {
            $query->where('is_published', request('published') === '1' ? true : false);
        }

        return $query->get();
    }

    public function store(Request $request, $schemaSlug)
    {
        $schema = CmsSchema::where('slug', $schemaSlug)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'required|string',
            'slug' => 'required|string|unique:cms_entries,slug,NULL,id,schema_id,' . $schema->id,
            // Add validation rules for dynamic fields
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $entry = CmsEntry::create([
            'schema_id' => $schema->id,
            'title' => $request->title,
            'slug' => $request->slug,
            'data' => $request->data,
            'is_published' => $request->has('is_published') ? $request->is_published : false,
            'author_id' => auth()->id() ?? null,
        ]);

        return response()->json($entry, 201);
    }

    public function show($schemaSlug, $entrySlug)
    {
        $schema = CmsSchema::where('slug', $schemaSlug)->firstOrFail();
        $entry = CmsEntry::where('schema_id', $schema->id)->where('slug', $entrySlug)->firstOrFail();

        return $entry;
    }

    public function update(Request $request, $id)
    {
        $entry = CmsEntry::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string',
            'slug' => 'sometimes|required|string|unique:cms_entries,slug,' . $id,
            'is_published' => 'sometimes|required|boolean',
            'data' => 'sometimes|array',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $entry->update($request->all());

        return response()->json($entry);
    }

    public function destroy($id)
    {
        $entry = CmsEntry::findOrFail($id);
        $entry->delete();

        return response()->json(null, 204);
    }
}