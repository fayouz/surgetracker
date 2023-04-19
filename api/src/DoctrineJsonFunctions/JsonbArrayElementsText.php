<?php

namespace App\DoctrineJsonFunctions;

use Scienta\DoctrineJsonFunctions\Query\AST\Functions\Postgresql\PostgresqlJsonFunctionNode;

/**
 * "JSONB_ARRAY_ELEMENTS_TEXT" "(" StringPrimary ")"
 */
class JsonbArrayElementsText extends PostgresqlJsonFunctionNode
{
	public const FUNCTION_NAME = 'JSONB_ARRAY_ELEMENTS_TEXT';

    /** @var string[] */
    protected $requiredArgumentTypes = [self::STRING_PRIMARY_ARG];
}
