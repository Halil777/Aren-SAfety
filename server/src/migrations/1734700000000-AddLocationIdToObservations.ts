import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from 'typeorm';

export class AddLocationIdToObservations1734700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add locationId column to observations table
    await queryRunner.addColumn(
      'observations',
      new TableColumn({
        name: 'locationId',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add foreign key constraint
    await queryRunner.createForeignKey(
      'observations',
      new TableForeignKey({
        columnNames: ['locationId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'locations',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Find and drop the foreign key
    const table = await queryRunner.getTable('observations');
    const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.indexOf('locationId') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('observations', foreignKey);
    }

    // Drop the locationId column
    await queryRunner.dropColumn('observations', 'locationId');
  }
}
