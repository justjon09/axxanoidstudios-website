<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CmsField;
use App\Models\CmsSchema;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CmsSchemaController extends Controller
{
    public function index()
    {
        return CmsSchema::with('fields')->get();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'slug' => 'required|string|unique:cms_schemas,slug',
            'description' => 'required|string',
            'icon' => 'required|string',
            'is_public' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $schema = CmsSchema::create($request->all());

        return response()->json($schema, 201);
    }

    public function show($id)
    {
        return CmsSchema::with('fields')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $schema = CmsSchema::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string',
            'slug' => 'sometimes|required|string|unique:cms_schemas,slug,' . $id,
            'description' => 'sometimes|required|string',
            'icon' => 'sometimes|required|string',
            'is_public' => 'sometimes|required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $schema->update($request->all());

        return response()->json($schema);
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