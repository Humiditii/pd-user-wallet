import { FetchPropI } from "./interface/main.interface";

export class BaseRepository<T extends { id: string }> {
    protected data: Map<string, T> = new Map();

    async create(item: T): Promise<T> {
        this.data.set(item.id, item);
        return item;
    }

    async findById(id: string): Promise<T | null> {
        return this.data.get(id) || null;
    }

    async findOne(filter: (item: T) => boolean): Promise<T | null> {
        for (const item of this.data.values()) {
            if (filter(item)) return item;
        }
        return null;
    }

    async update(id: string, updateData: Partial<T>): Promise<T | null> {
        const item = this.data.get(id);
        if (!item) return null;
        const updatedItem = { ...item, ...updateData };
        this.data.set(id, updatedItem);
        return updatedItem;
    }

    async delete(id: string): Promise<void> {
        this.data.delete(id);
    }

    async count(filter?: (item: T) => boolean): Promise<number> {
        if (!filter) return this.data.size;
        let count = 0;
        for (const item of this.data.values()) {
            if (filter(item)) count++;
        }
        return count;
    }

    async search(
        filter: (item: T) => boolean = () => true,
        fetchProp?: FetchPropI,
        sortFn: (a: T, b: T) => number = () => 0
    ): Promise<{ documents: T[], count: number }> {
        let items = Array.from(this.data.values()).filter(filter);
        const count = items.length;

        items.sort(sortFn);

        if (fetchProp?.fetchAll !== 'yes') {
            const limit = fetchProp?.limit ?? 10;
            const page = fetchProp?.page ?? 1;
            const skip = (page - 1) * limit;
            items = items.slice(skip, skip + limit);
        }

        return {
            documents: items,
            count,
        };
    }
}
