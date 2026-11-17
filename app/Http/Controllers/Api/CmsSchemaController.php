<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsField;
use App\Models\CmsSchema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CmsSchemaController extends Controller
{
    public function index()
    {
        return response()->json(CmsSchema::all());
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
        return response()->json($schema, 201);
    }

    public function show($id)
    {
        $schema = CmsSchema::findOrFail($id);
        $schema->load('fields');
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
            'label' => 'required|string',
            'handle' => 'required|string',
            'field_type' => 'required|string',
            'validation_rules' => 'sometimes|string',
            'sort_order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $field = CmsField::create([
            'schema_id' => $schema->id,
            'label' => $request->label,
            'handle' => $request->handle,
            'field_type' => $request->field_type,
            'validation_rules' => $request->validation_rules,
            'sort_order' => $request->sort_order,
        ]);

        return response()->json($field, 201);
    }
}
