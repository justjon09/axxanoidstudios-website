<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsField;
use App\Models\CmsSchema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CmsSchemaController extends Controller
{
    public function index()
    {
        return response()->json(
            CmsSchema::with('fields')->orderBy('name', 'asc')->get()
        );
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:100',
            'slug' => 'nullable|string|max:100|unique:cms_schemas,slug',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'is_public' => 'boolean',
        ]);

        $schema = CmsSchema::create($validatedData);
        $schema->load('fields');

        return response()->json($schema, 201);
    }

    public function show($id)
    {
        $schema = CmsSchema::with('fields')->findOrFail($id);
        return response()->json($schema);
    }

    public function update(Request $request, $id)
    {
        $schema = CmsSchema::findOrFail($id);

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'slug' => 'sometimes|required|string|max:100|unique:cms_schemas,slug,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
            'is_public' => 'boolean',
        ]);

        $schema->update($validatedData);
        $schema->load('fields');

        return response()->json($schema);
    }

    public function destroy($id)
    {
        $schema = CmsSchema::findOrFail($id);
        $schema->delete();

        return response()->json(null, 204);
    }

    public function addField(Request $request, $id)
    {
        $schema = CmsSchema::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'label' => 'required|string|max:100',
            'handle' => 'required|string|max:100',
            'field_type' => 'required|string|in:text,textarea,wysiwyg,number,json,media,toggle,boolean',
            'validation_rules' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $normalizedHandle = Str::slug($request->handle, '_');

        $field = CmsField::create([
            'schema_id' => $schema->id,
            'label' => $request->label,
            'handle' => $normalizedHandle,
            'field_type' => $request->field_type,
            'validation_rules' => $request->validation_rules ?: null,
            'sort_order' => $request->input('sort_order', 0),
        ]);

        return response()->json($field, 201);
    }

    public function deleteField($id, $fieldId)
    {
        $field = CmsField::where('schema_id', $id)->findOrFail($fieldId);
        $field->delete();

        return response()->json(null, 204);
    }
}